import Web3 from 'web3'
import { getInstance, hmmmToAha, getBlockDeployedAt } from '../../utils'
import { networkName, LoadingStage, NotificationTopic } from '../../constants'
import { processEvent } from '../assessment/asyncActions'
import { setModal } from '../navigation/actions'
import { web3EventsConnected, receiveVariable, registerSubscription } from './actions'
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

    // set up second web3 instance to subscribe to events via websocket
    let network = networkName(getState().ethereum.networkID)
    if (network === 'Kovan') {
      dispatch(web3EventsConnected({})) // to set isConnectedVariable to true
    } else {
      // rinkeby or local testnet
      // TODO try the same thing for kovan with https://kovan.infura.io/ws/v3/2FBsjXKlWVXGLhKn7PF7'),
      let web3events = new Web3()
      let providerAddress = networkName(network) === 'Rinkeby' ? 'wss://rinkeby.infura.io/ws/v3/2FBsjXKlWVXGLhKn7PF7' : 'ws://localhost:8545'
      console.log('providerAddress ', providerAddress)
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
    console.log('deployedFathomTokenAt ', deployedFathomTokenAt )
    if (true || !deployedFathomTokenAt) {
      deployedFathomTokenAt = Number(await getBlockDeployedAt.fathomToken(getState()))
      let deployedConceptRegistryAt = Number(await getBlockDeployedAt.conceptRegistry(getState()))
      dispatch(receiveVariable('deployedFathomTokenAt', deployedFathomTokenAt))
      dispatch(receiveVariable('deployedConceptRegistryAt', deployedConceptRegistryAt))
    }

    // Assessments
    // TODO modify event processing Actions to cancel subscriptions if assessment becomes out of date
    dispatch(fetchLatestAssessments())
    // Concepts
    dispatch(loadConceptsFromConceptRegistry())

    dispatch(setBlockDataLoadingStage('Loaded'))
  }
}

export const setUpAssessmentEventWatcher = (assessmentAddress) => {
  return async (dispatch, getState) => {
    let web3WS = getState().ethereum.web3events
    let userAddress = getState().ethereum.userAddress
    let web3 = getState().ethereum.web3
    let notificationJSON = FathomToken.abi.filter(x => x.name === 'Notification')[0]
    let fathomTokenAddress = FathomToken.networks[getState().ethereum.networkID].address
    let assessmentAddressAsTopic = web3.utils.padLeft(web3.utils.toHex(assessmentAddress), 64)
    // topic order: Notification-Event-Signature, user, assessment/sender, topic
    let subscription = web3WS.eth.subscribe('logs', {
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
    dispatch(registerSubscription(subscription, assessmentAddress))
  }
}

const initializeEventWatcher = () => {
  return async (dispatch, getState) => {
    let networkID = getState().ethereum.networkID
    let userAddress = getState().ethereum.userAddress
    if (networkID === 42) {
      // kovan
      const dagger = new Dagger('wss://kovan.dagger.matic.network')
      const fathomTokenInstance = getInstance.fathomToken(getState())
      let fathomTokenDagger = dagger.contract(fathomTokenInstance)
      var filter = fathomTokenDagger.events.Notification({
        room: 'latest',
        // filter: {user: userAddress, topic: [NotificationTopic.AssessmentCreated, NotificationTopic.CalledAsAssessor]} 
      })
      console.log('TODO THE FILTER NEEDS TO BE TESTED')
      // console.log('filter ', filter )
      filter.watch((data, removed) => {
        console.log('dagger-event found', data)
        // updates are only dispatched if
        // they come from an assessment the user is involved in AND one of the following
        // a) the user is looking at it
        // b) the user has already been on the dashboard page once
        // if ((getState().assessments[data.returnValues.sender] || data.returnValues.user === userAddress) &&
             // getState().loading.assessments >= LoadingStage.None) {
          dispatch(processEvent(
            data.returnValues.user,
            data.returnValues.sender,
            Number(data.returnValues.topic),
            data.blockNumber
          ))
        // }
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
