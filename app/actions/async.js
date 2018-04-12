import Web3 from 'web3'

export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'
export const RECEIVE_VARIABLE = 'RECEIVE_VARIABLE'
export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
export const RECEIVE_ASSESSORS = 'RECEIVE_ASSESSORS'
export const SET_ASSESSMENT = 'SET_ASSESSMENT'

// actions to instantiate web3
export const web3Connect = () => {
  return async (dispatch, getState) => {
    if (typeof window.web3 !== 'undefined') {
      let w3 = new Web3(window.web3.currentProvider)
      // after web3 is instanciated, fetch contract info (mew concept) and user address
      if (w3) {
        dispatch(web3Connected(w3))
        dispatch(fetchUserAddress()) // which will get user related info -> balance
        dispatch(fetchNetworkID()) // which will get contract related info -> list of concepts from registry
      } else {
        dispatch(web3Disconnected())
      }
    } else {
      // if no metamask, use rinkeby and set to public View
      let w3 = new Web3('https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7')
      dispatch(web3Connected(w3))
      dispatch(receiveVariable('userAddress', 'publicView'))
    }
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

// to save in state that one could not connect
export function web3Disconnected () {
  return {
    type: WEB3_DISCONNECTED,
    payload: {}
  }
}

export function fetchUserAddress () {
  return async (dispatch, getState) => {
    let w3 = getState().connect.web3
    let accounts = await w3.eth.getAccounts()
    if (accounts.length === 0) {
      dispatch(receiveVariable('userAddress', 'pleaseEnterPasswordToUnblockMetamask'))
    } else {
      dispatch(receiveVariable('userAddress', accounts[0]))
      dispatch(fetchAHABalance())
    }
  }
}

export function fetchNetworkID () {
  return async (dispatch, getState) => {
    let w3 = getState().connect.web3
    let networkID = await w3.eth.net.getId()
    dispatch(receiveVariable('networkID', networkID))
  }
}

export function fetchAHABalance () {
  return async (dispatch, getState) => {
    let w3 = getState().connect.web3
    let userAddress = getState().connect.userAddress
    let networkID = await w3.eth.net.getId()

    // get token contract
    // THIS THROWS AN ERROR 
    const ahaArtifact = require('../../build/contracts/FathomToken.json')
    const ahaContract = await new w3.eth.Contract(ahaArtifact.abi, ahaArtifact.networks[networkID].address)
    // get balance from contract
    let userBalance = await ahaContract.methods.balanceOf(userAddress).call()
    dispatch(receiveVariable('balance', userBalance))
  }
}

export function receiveAssessment(assessment) {
  return {
    type: RECEIVE_ASSESSMENT,
    payload: {
      assessment
    }
  }
}

export function setAssessment (address) {
  return {
    type: SET_ASSESSMENT,
    payload : {
      address
    }
  }
}

export function fetchAssessmentData (address) {
  return async (dispatch, getState) => {
    let w3 = getState().connect.web3
    try {
      const assessmentArtifact = require('../../build/contracts/Assessment.json')
      const assessmentInstance = new w3.eth.Contract(assessmentArtifact.abi, address)
      let cost = await assessmentInstance.methods.cost().call()
      let size = await assessmentInstance.methods.size().call()
      let stage = await assessmentInstance.methods.assessmentStage().call()
      let assessee = await assessmentInstance.methods.assessee().call()
      dispatch(receiveAssessment({
        address: address,
        cost: cost,
        size: size,
        assessee: assessee,
        stage: stage,
      }))
    } catch(e) {
      console.log('reading from the chain did not work!', e)
    }
  }
}

// reads all staked assessors from event-logs and TODO reads their stage from the chain
// if the assessment is in the calling phase one also checks whether the user has been called
// and if, so he will be added to the list of assessors with his stage set to 1
export function fetchAssessors (address, stage) {
  return async (dispatch, getState) => {
    let w3 = getState().connect.web3
    let networkID = getState().connect.networkID
    let userAddress = getState().connect.userAddress
    // console.log('stagetype', typeof stage)
    try {
      // reading assessors from events
      const fathomTokenArtifact = require('../../build/contracts/FathomToken.json')
      const fathomTokenInstance = new w3.eth.Contract(fathomTokenArtifact.abi, fathomTokenArtifact.networks[networkID].address)
      // NOTE: this piece is a bit tricky, as filtering in the call usually works on the local testnet, but not on rinkeby
      // for rinkeby one has to get all events and filter locally
      let pastEvents = await fathomTokenInstance.getPastEvents({fromBlock:0, toBlock:"latest"})
      if (pastEvents.length === []) {
        console.log('weirdly no Notifications events have been found. Try switching Metamasks network back and forth')
      }
      let assessors = []
      if (stage === '1') {
        let calledNotifications = pastEvents.filter(e =>
                                                    e.event == 'Notification' &&
                                                    e.returnValues['sender'] === address &&
                                                    e.returnValues['user'] === userAddress &&
                                                    e.returnValues['topic'] === '1' && //NOTE: unclear why topic is a string!
                                                    assessors.push({
                                                      address: 'hey look, this is you!!', //e.returnValues['user']
                                                      stage: '1'
                                                    })
                                                   )
      }
      console.log('assessors after looking for calling',assessors )
      let stakedEvents = pastEvents.filter(e =>
                                           e.event == 'Notification' &&
                                           e.returnValues['sender'] === address &&
                                           e.returnValues['topic'] === '2' &&
                                           assessors.push({address: e.returnValues['user']})
                                          )
      console.log('asessors after looking for staked Events ', assessors )
      // TODO: get stages by dispatching a update-assessor-stage-action
      dispatch(receiveAssessors(address, assessors))
    } catch(e) {
      console.log('ERROR: fetching assessors from the events did not work!', e)
    }
  }
}

export function receiveAssessors (address, assessors) {
  return {
    type: RECEIVE_ASSESSORS,
    payload: {
      address,
      assessors
    }
  }
}


// to save something from the chain in state
export function receiveVariable (name, value) {
  return {
    type: RECEIVE_VARIABLE,
    payload: {
      name: name,
      value: value
    }
  }
}

export const actions = {
  web3Connect
}
