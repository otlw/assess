import Web3 from 'web3'
import { getInstance } from '../utils.js'
import { networkName, LoadingStage } from '../constants.js'
// import { fetchAssessmentData } from './assessmentActions.js' // TODO import function that updates assessments
var Dagger = require('eth-dagger')

export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3EVENTS_CONNECTED = 'WEB3EVENTS_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'
export const RECEIVE_VARIABLE = 'RECEIVE_VARIABLE'

// actions to instantiate web3 related info
export const connect = () => {
  return async (dispatch, getState) => {
    // get web3 object with right provider
    if (typeof window.web3 !== 'undefined') {
      // set first web3 instance to do read and write calls via Metamask
      let w3 = new Web3(window.web3.currentProvider)
      // after web3 is instanciated, fetch networkID and user address
      if (w3) {
        dispatch(web3Connected(w3))

        // get networkID
        let networkID = await w3.eth.net.getId()
        dispatch(receiveVariable('networkID', networkID))

        // get userAddress
        let accounts = await w3.eth.getAccounts()
        if (accounts.length === 0) {
          dispatch(receiveVariable('userAddress', 'pleaseEnterPasswordToUnblockMetamask'))
        } else {
          dispatch(receiveVariable('userAddress', accounts[0]))
          // get balance from contract
          let fathomTokenInstance = getInstance.fathomToken(getState())
          let userBalance = await fathomTokenInstance.methods.balanceOf(accounts[0]).call()
          dispatch(receiveVariable('AhaBalance', userBalance))
        }

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

      //what should we display when no MM??

      // if no metamask, use rinkeby and set to public View
      //let w3 = new Web3('https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7')
      // dispatch(web3Connected(w3))
      // dispatch(receiveVariable('userAddress', 'No Account Connected'))


      window.alert("Either you don't have the MetaMask browser extension, or you have it and you need to enter your password.\n"
        //In the mean time, we'll be showing on-chain data loaded from Infura."
      )
    }
  }
}

const initializeEventWatcher = () => {
  return async (dispatch, getState) => {
    let networkID = getState().ethereum.networkID
    let userAddress = getState().ethereum.userAddress
    let assessmentView = getState().assessments.selectedAssessment
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
            (assessmentView === data.returnValues.sender ||
             getState().loading.assessments >= LoadingStage.None)) {
          // TODO call function to update event
        }
      })
    } else {
      const fathomTokenArtifact = require('../../build/contracts/FathomToken.json')
      let web3WS = getState().ethereum.web3events
      let notificationJSON = fathomTokenArtifact.abi.filter(x => x.name === 'Notification')[0]
      let ahadress = fathomTokenArtifact.networks[getState().ethereum.networkID].address
      web3WS.eth.subscribe('logs', {
        address: ahadress,
        topics: ['0xe41f8f86e0c2a4bb86f57d2698c1704cd23b5f42a84336cdb49377cdca96d876'] // notification topic
      }, (error, log) => {
        if (error) {
          console.log('event subscirption error!:')
        }
        console.log('WS-event found', log) //, log.data, log.topics.length)
        let decodedLog = web3WS.eth.abi.decodeLog(
          notificationJSON.inputs,
          log.data,
          log.topics.slice(1, 4)
        )
        // updates are only dispatched if
        // they come from an assessment the user is involved in AND one of the following
        // a) the user is looking at it
        // b) the user has already been on the dashboard page once
        if ((getState().assessments[decodedLog.sender] || decodedLog.user === userAddress) &&
            (assessmentView === decodedLog.sender ||
             getState().loading.assessments >= LoadingStage.None)) {
          // console.log('dispatching update. inlc saying to update all assesssors->', getState().assessments.selectedAssessment === decodedLog.sender) // true -> load information for all assessors
          // TODO call function to update event
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

// action to save the connedted web3-instance in state
export function web3Connected (web3) {
  return {
    type: WEB3_CONNECTED,
    payload: {
      web3: web3,
      version: web3.version
    }
  }
}

// action to save the websocket web3-instance in state
export function web3EventsConnected (web3) {
  return {
    type: WEB3EVENTS_CONNECTED,
    payload: {
      web3events: web3
    }
  }
}
// to save in state that one could not connect
export function web3Disconnected () {
  return {
    type: WEB3_DISCONNECTED,
    payload: {}
  }
}

// to save something from the chain in state
export function receiveVariable (name, value) {
  return {
    type: RECEIVE_VARIABLE,
    name,
    value
  }
}
