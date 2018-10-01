import Web3 from 'web3'
import { getInstance, hmmmToAha, getLocalStorageKey, getBlockDeployedAt } from '../../utils'
import { networkName, LoadingStage } from '../../constants'
import { processEvent } from '../assessment/asyncActions'
import { setModal } from '../navigation/actions'
import {receiveAllAssessments} from '../assessment/actions.ts'
import {receiveConcepts} from '../concept/actions.ts'
import { receiveVariable, receivePersistedState } from './actions'
import { modalTopic } from '../../components/Helpers/helperContent'

var Dagger = require('eth-dagger')
const { FathomToken } = require('fathom-contracts')

// actions to instantiate web3 related info
export const connect = () => {
  return async (dispatch, getState) => {
    let fathomTokenDeployedAt = getState().ethereum.fathomTokenDeployedAt
    if (!fathomTokenDeployedAt) dispatch(loadFathomNetworkParams())
    dispatch(fetchUserBalance())

    // set up event watcher
    dispatch(initializeEventWatcher())
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

export const loadPersistedState = (networkID, userAddress, web3) => {
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
      if (persistedState.concepts) {
        dispatch(receiveConcepts(persistedState.concepts))
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

      let providerAddress = networkName(networkID) === 'Rinkeby' ? 'wss://rinkeby.infura.io/ws' : 'ws://localhost:8545'
      console.log('providerAddress ', providerAddress)
      const eventProvider = new Web3.providers.WebsocketProvider(providerAddress)
      eventProvider.on('error', e => console.error('WS Error', e))
      eventProvider.on('end', e => console.error('WS End', e))
      let web3WS = new Web3(eventProvider)

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
          dispatch(processEvent(decodedLog.user, decodedLog.sender, Number(decodedLog.topic), log.blockNumber))
        } else {
          console.log('not updating!')
        }
      })
    }
  }
}

export const fetchUserBalance = () => {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let fathomTokenInstance = getInstance.fathomToken(getState())
    if (fathomTokenInstance.error) {
      dispatch(setModal(modalTopic.UndeployedNetwork))
    } else {
      let userBalance = hmmmToAha(await fathomTokenInstance.methods.balanceOf(userAddress).call())
      dispatch(receiveVariable('AhaBalance', userBalance))
    }
  }
}
