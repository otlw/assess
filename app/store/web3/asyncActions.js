import Web3 from 'web3'
import { getInstance, hmmmToAha, getBlockDeployedAt } from '../../utils'
import { networkName, LoadingStage, NotificationTopic } from '../../constants'
import { processEvent } from '../assessment/asyncActions'
import { setModal } from '../navigation/actions'
import { web3EventsConnected, receiveVariable } from './actions'
import { modalTopic } from '../../components/Helpers/helperContent'
import {setBlockDataLoadingStage} from '../../store/loading/actions.ts'
import {fetchLatestAssessments} from '../../store/assessment/asyncActions.js'
import {loadConceptsFromConceptRegistry} from '../../store/concept/asyncActions.js'

var Dagger = require('eth-dagger')
const { FathomToken } = require('fathom-contracts')

export const loadAllData = () => {
  return async (dispatch, getState) => {
    dispatch(setBlockDataLoadingStage('Loading'))

    // user Balance
    dispatch(fetchUserBalance())

    // listen to events by setting up a second web3 instance to subscribe to events via websocket
    let network = networkName(getState().ethereum.networkID)
    console.log('network ', network )
    let providerAddress
    let web3events = new Web3()
    if (network === 'Kovan') {
      // providerAddress = 'wss://kovan.infura.io/v3/b5afe7c5e5a34359a1852ad30d50fa48'
    } else {
      // local testnet
      providerAddress = 'ws://localhost:8545'
    }
    console.log('providerAddress ', providerAddress)
    if (providerAddress) {
      const eventProvider = new Web3.providers.WebsocketProvider(providerAddress)
      eventProvider.on('error', e => console.error('WS Error', e))
      eventProvider.on('end', e => console.error('WS End', e))
      web3events.setProvider(eventProvider)
      dispatch(web3EventsConnected(web3events))
    }

    // set up event watcher to watch for new events relevant to user (such as calledAsAssessor or createdAssessment)
    dispatch(initializeEventWatcher())

    // fathom-network-params, to see how far to go back
    let deployedFathomTokenAt = getState().ethereum.deployedFathomTokenAt
    if (!deployedFathomTokenAt) {
      // look up when the network was deployed
      console.log('only once: Look up when network was deployed')
      deployedFathomTokenAt = Number(await getBlockDeployedAt.fathomToken(getState()))
      let deployedConceptRegistryAt = Number(await getBlockDeployedAt.conceptRegistry(getState()))
      dispatch(receiveVariable('deployedFathomTokenAt', deployedFathomTokenAt))
      dispatch(receiveVariable('deployedConceptRegistryAt', deployedConceptRegistryAt))
    } else {
      // NOTE remove when no longer debugging
      console.log('deployedFathomTokenAt exits:', deployedFathomTokenAt )
    }
    // fetch Assessments
    dispatch(fetchLatestAssessments())
    // fetch concepts
    dispatch(loadConceptsFromConceptRegistry())
    // all data reading processes have been initiated, so mark stage as ready
    dispatch(setBlockDataLoadingStage('Loaded'))
  }
}

export const setUpAssessmentEventWatcher = (assessmentAddress) => {
  return async (dispatch, getState) => {
    // TODO do the same for kovan with dagger
    let network = networkName(getState().ethereum.networkID)
    if (network === 'Kovan') {
      // TODO try the websocket thing for kovan/rinkeby/mainnet
      // providerAddress = 'wss://kovan.infura.io/v3/b5afe7c5e5a34359a1852ad30d50fa48' // NOTE any contract we want to subscribe to needs to be whitelisted on the infura-site
        const dagger = new Dagger('wss://kovan.dagger.matic.network')
        const fathomTokenInstance = getInstance.fathomToken(getState())
        let fathomTokenDagger = dagger.contract(fathomTokenInstance)
        console.log('TODO THE FILTER NEEDS TO BE TESTED')
        var filter = fathomTokenDagger.events.Notification({
          room: 'latest',
          filter: {sender: assessmentAddress}
        })
        // console.log('filter ', filter )
        filter.watch((data, removed) => {
          console.log('assessmnet specific dagger-event found', data)
          dispatch(processEvent(
            data.returnValues.user,
            data.returnValues.sender,
            Number(data.returnValues.topic),
            data.blockNumber
          ))
        })
    } else {
      // local testnet
      let web3WS = getState().ethereum.web3events
      let userAddress = getState().ethereum.userAddress
      let web3 = getState().ethereum.web3
      let notificationJSON = FathomToken.abi.filter(x => x.name === 'Notification')[0]
      let fathomTokenAddress = FathomToken.networks[getState().ethereum.networkID].address
      let assessmentAddressAsTopic = web3.utils.padLeft(web3.utils.toHex(assessmentAddress), 64)
      // topic order: Notification-Event-Signature, user, assessment/sender, topic
      web3WS.eth.subscribe('logs', {
        address: fathomTokenAddress,
        topics: [
          '0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876',
          null,
          assessmentAddressAsTopic,
          null
        ]
      }, (error, log) => {
        if (error) {
          console.log('event subscirption error!:')
        }
        let decodedLog = web3WS.eth.abi.decodeLog(
          notificationJSON.inputs,
          log.data,
          log.topics.slice(1, 4)
        )
        dispatch(processEvent(decodedLog.user, decodedLog.sender, Number(decodedLog.topic), log.blockNumber))
      })
    }
  }
}

const initializeEventWatcher = () => {
  return async (dispatch, getState) => {
    let networkID = getState().ethereum.networkID
    let network = networkName(getState().ethereum.networkID)
    let userAddress = getState().ethereum.userAddress
    if (networkID === 'Kovan') {
      // kovan
      const dagger = new Dagger('wss://kovan.dagger.matic.network')
      const fathomTokenInstance = getInstance.fathomToken(getState())
      let fathomTokenDagger = dagger.contract(fathomTokenInstance)
      console.log('TODO THE FILTER NEEDS TO BE TESTED')
      var filter = fathomTokenDagger.events.Notification({
        room: 'latest',
        filter: {user: userAddress, topic: [NotificationTopic.AssessmentCreated, NotificationTopic.CalledAsAssessor]} 
      })
      // console.log('filter ', filter )
      filter.watch((data, removed) => {
        console.log('dagger-event found', data)
          dispatch(processEvent(
            data.returnValues.user,
            data.returnValues.sender,
            Number(data.returnValues.topic),
            data.blockNumber
          ))
      })
    } else {
      // local testnet
      let web3WS = getState().ethereum.web3events
      let web3 = getState().ethereum.web3
      let notificationJSON = FathomToken.abi.filter(x => x.name === 'Notification')[0]
      let fathomTokenAddress = FathomToken.networks[getState().ethereum.networkID].address
      let userAsTopic = web3.utils.padLeft(web3.utils.toHex(userAddress), 64)
      let newAssessmentTopics = [
        web3.utils.padLeft(web3.utils.toHex(NotificationTopic.AssessmentCreated), 64),
        web3.utils.padLeft(web3.utils.toHex(NotificationTopic.CalledAsAssessor), 64)
      ]
      // topic order: Notification-Event-Signature, user, assessment/sender, topic
      web3WS.eth.subscribe('logs', {
        address: fathomTokenAddress,
        topics: [
          '0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876',
          userAsTopic,
          null,
          newAssessmentTopics
        ]
      }, (error, log) => {
        if (error) {
          console.log('event subscirption error!:')
        }
        if (log) {
          console.log('caught log', log)
          let decodedLog = web3WS.eth.abi.decodeLog(
            notificationJSON.inputs,
            log.data,
            log.topics.slice(1, 4)
          )
          dispatch(processEvent(decodedLog.user, decodedLog.sender, Number(decodedLog.topic), log.blockNumber))
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
