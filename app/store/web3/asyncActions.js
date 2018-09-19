import Web3 from 'web3'
import { getInstance, hmmmToAha, getLocalStorageKey, getBlockDeployedAt } from '../../utils'
import { networkName, LoadingStage } from '../../constants'
import { processEvent } from '../assessment/asyncActions'
import { setMainDisplay } from '../navigation/actions'
import {receiveAllAssessments} from '../assessment/actions.ts'
import { web3Connected, web3EventsConnected, web3Disconnected, receiveVariable, receivePersistedState } from './actions'

var Dagger = require('eth-dagger')
const { FathomToken } = require('fathom-contracts')

// actions to instantiate web3 related info
export const connect = () => {
  return async (dispatch, getState) => {
    // get web3 object with right provider
    if (typeof window.web3 !== 'undefined') {
      // set first web3 instance to do read and write calls via Metamask
      let w3 = new Web3(window.web3.currentProvider)
      // after web3 is instanciated, fetch networkID and user address
      if (w3) {
        // get networkID and THEN set isConnected
        let networkID = await w3.eth.net.getId()
        dispatch(receiveVariable('networkID', networkID))
        dispatch(web3Connected(w3))

        // get userAddress
        let accounts = await w3.eth.getAccounts()
        if (accounts.length === 0) {
          // this is when MM is locked
          dispatch(setMainDisplay('UnlockMetaMask'))
        } else {
          dispatch(receiveVariable('userAddress', accounts[0]))
          dispatch(fetchUserBalance())
        }

        // load persistedState for the respective network and the user
        dispatch(loadPersistedState(networkID, accounts[0], w3))
        if (getState().ethereum.fathomTokenDeployedAt === '') dispatch(loadFathomNetworkParams())

        // set a second web3 instance to subscribe to events via websocket
        if (networkName(networkID) === 'Kovan') {
          dispatch(web3EventsConnected({})) // to set isConnectedVariable to true
        } else {
          // rinkeby or local testnet
          let web3events = new Web3()
          let providerAddress = networkName(networkID) === 'Rinkeby' ? 'wss://rinkeby.infura.io/ws' : 'ws://localhost:8545'
          console.log('providerAddress ', providerAddress)
          const eventProvider = new Web3.providers.WebsocketProvider(providerAddress)
          eventProvider.on('error', e => console.error('WS Error', e))
          eventProvider.on('end', e => console.error('WS End', e))
          web3events.setProvider(eventProvider)
          dispatch(web3EventsConnected(web3events))
        }
        // set up event watcher
        dispatch(initializeEventWatcher())

        // set a loop function to check userAddress or network change
        dispatch(loopCheckAddressAndNetwork())
      } else {
        dispatch(web3Disconnected())
      }
    } else {
      // If the user has no MetaMask extension, a different screen will be displayed instead of the App
      dispatch(setMainDisplay('NoMetaMask'))
      window.alert("You don't have the MetaMask browser extension.")
    }
  }
}

const loadFathomNetworkParams = () => {
  return async (dispatch, getState) => {
    console.log('ONLY ONCE!: looking up when stuff was deployed kk')
    let deployedFathomTokenAt = await getBlockDeployedAt.fathomToken(getState())
    let deployedConceptRegistryAt = await getBlockDeployedAt.conceptRegistry(getState())
    dispatch(receiveVariable('deployedFathomTokenAt', deployedFathomTokenAt))
    dispatch(receiveVariable('deployedConceptRegistryAt', deployedConceptRegistryAt))
  }
}

const loadPersistedState = (networkID, userAddress, web3) => {
  return async (dispatch, getState) => {
    try {
      let key = getLocalStorageKey(networkID, userAddress, web3)
      // let key = networkName(networkID) + 'State' + userAddress
      const serializedState = localStorage.getItem(key) // eslint-disable-line no-undef
      if (serializedState === null) {
        return undefined
      }
      let persistedState = JSON.parse(serializedState)
      if (persistedState.assessments) {
        dispatch(receiveAllAssessments(persistedState.assessments))
      }
      dispatch(receivePersistedState(persistedState))
    } catch (e) {
      console.log('ERROR reading from localStorage')
    }
  }
}

const initializeEventWatcher = () => {
  return async (dispatch, getState) => {
    let networkID = getState().ethereum.networkID
    let userAddress = getState().ethereum.userAddress
    // subscribe to all events: testnet / rinkeby
    if (networkID === 42) {
      // kovan
      const dagger = new Dagger('wss://kovan.dagger.matic.network')
      const fathomTokenInstance = getInstance.fathomToken(getState())
      let fathomTokenDagger = dagger.contract(fathomTokenInstance)
      var filter = fathomTokenDagger.events.Notification({
        room: 'latest'
      })
      filter.watch((data, removed) => {
        console.log('dagger-event found', data)
        // updates are only dispatched if
        // they come from an assessment the user is involved in AND one of the following
        // a) the user is looking at it
        // b) the user has already been on the dashboard page once
        if ((getState().assessments[data.returnValues.sender] || data.returnValues.user === userAddress) &&
             getState().loading.assessments >= LoadingStage.None) {
          dispatch(processEvent(
            data.returnValues.user,
            data.returnValues.sender,
            Number(data.returnValues.topic),
            data.blockNumber
          ))
        }
      })
    } else {
      // local testnet
      let web3WS = getState().ethereum.web3events
      let notificationJSON = FathomToken.abi.filter(x => x.name === 'Notification')[0]
      let fathomTokenAddress = FathomToken.networks[getState().ethereum.networkID].address
      web3WS.eth.subscribe('logs', {
        address: fathomTokenAddress,
        topics: ['0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876'] // notification topic
      }, (error, log) => {
        if (error) {
          console.log('event subscirption error!:')
        }
        let decodedLog = web3WS.eth.abi.decodeLog(
          notificationJSON.inputs,
          log.data,
          log.topics.slice(1, 4)
        )

        // updates are only dispatched if
        // they come from an assessment the user is involved in AND one of the following
        // a) the user is looking at it
        // b) the user has already been on the dashboard page once
        if ((getState().assessments[decodedLog.sender] || decodedLog.user === userAddress)) {
          dispatch(processEvent(decodedLog.user, decodedLog.sender, Number(decodedLog.topic)))
          dispatch(processEvent(decodedLog.user, decodedLog.sender, Number(decodedLog.topic), log.blockNumber))
        } else {
          console.log('not updating!')
        }
      })
    }
  }
}

// checks userAddress and networkID every second to detect change and reload app
export const loopCheckAddressAndNetwork = () => {
  return async (dispatch, getState) => {
    setInterval(async function () {
      let w3 = getState().ethereum.web3

      // get networkID and compare to previous
      let networkID = await w3.eth.net.getId()
      if (networkID !== getState().ethereum.networkID) {
        // if different, just reload the whole app (all the data is changed)
        // maybe we could call connect() instead but since all components reload its kinda the same...
        window.location.reload()
      }

      // get userAddress and compare to previous
      let accounts = await w3.eth.getAccounts()
      if (accounts.length === 0) {
        dispatch(receiveVariable('userAddress', 'pleaseEnterPasswordToUnblockMetamask'))
      } else {
        if (accounts[0] !== getState().ethereum.userAddress) {
          // if different, just reload the whole app (all the data is changed)
          // maybe we could call connect() instead but since all components reload its kinda the same...
          window.location.reload()
        }
      }
    }, 1000)
  }
}

export const fetchUserBalance = () => {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let fathomTokenInstance = getInstance.fathomToken(getState())
    if (fathomTokenInstance.error) {
      dispatch(setMainDisplay('UndeployedNetwork'))
    } else {
      let userBalance = hmmmToAha(await fathomTokenInstance.methods.balanceOf(userAddress).call())
      dispatch(receiveVariable('AhaBalance', userBalance))
    }
  }
}
