import Web3 from 'web3'
import { getInstance, hmmmToAha, getBlockDeployedAt } from '../../utils'
import { networkName, LoadingStage } from '../../constants'
import { processEvent } from '../assessment/asyncActions'
import { setModal } from '../navigation/actions'
import { web3EventsConnected, receiveVariable } from './actions'
import { modalTopic } from '../../components/Helpers/helperContent'

var Dagger = require('eth-dagger')
const { FathomToken } = require('fathom-contracts')

// actions to instantiate web3 related info
export const connect = () => {
  return async (dispatch, getState) => {
    let deployedFathomTokenAt = getState().ethereum.deployedFathomTokenAt
    let network = networkName(getState().ethereum.networkID)

    if (!deployedFathomTokenAt) dispatch(loadFathomNetworkParams())
    dispatch(fetchUserBalance())

    // set a second web3 instance to subscribe to events via websocket
    if (network === 'Kovan') {
      dispatch(web3EventsConnected({})) // to set isConnectedVariable to true
    } else {
      // rinkeby or local testnet
      let web3events = new Web3()
      let providerAddress = networkName(network) === 'Rinkeby' ? 'wss://rinkeby.infura.io/ws' : 'ws://localhost:8545'
      console.log('providerAddress ', providerAddress)
      const eventProvider = new Web3.providers.WebsocketProvider(providerAddress)
      eventProvider.on('error', e => console.error('WS Error', e))
      eventProvider.on('end', e => console.error('WS End', e))
      web3events.setProvider(eventProvider)
      dispatch(web3EventsConnected(web3events))
    }
    // set up event watcher
    dispatch(initializeEventWatcher())
  }
}

const loadFathomNetworkParams = () => {
  return async (dispatch, getState) => {
    console.log('ONLY ONCE!: looking up when stuff was deployed kk')
    let deployedFathomTokenAt = Number(await getBlockDeployedAt.fathomToken(getState()))
    let deployedConceptRegistryAt = Number(await getBlockDeployedAt.conceptRegistry(getState()))
    dispatch(receiveVariable('deployedFathomTokenAt', deployedFathomTokenAt))
    dispatch(receiveVariable('deployedConceptRegistryAt', deployedConceptRegistryAt))
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
