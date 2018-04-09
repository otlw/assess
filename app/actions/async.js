import Web3 from 'web3'

export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'
export const RECEIVE_VARIABLE = 'RECEIVE_VARIABLE'
export const GET_LATEST_BLOCK = 'GET_LATEST_BLOCK'

// actions to instantiate web3
export const web3Connect = () => {
  return async (dispatch, getState) => {
    if (typeof window.web3 !== 'undefined') {
      let w3 = new Web3(window.web3.currentProvider)
      // after web3 is instanciated, fetch contract info (mew concept) and user address
      if (w3) {
        dispatch(web3Connected(w3))
        dispatch(loadContractInstance('ConceptRegistry')) // which will trigger fetchFathomParams
        dispatch(loadNotificationsFromFathomToken()) // which will load the assessments
        dispatch(fetchUserAddress())
      } else {
        dispatch(web3Disconnected())
      }
    } else {
      console.log('no Metamask')
      let w3 = new Web3('https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7')
      dispatch(web3Connected(w3))
      dispatch(loadContractInstance('ConceptRegistry')) // which will trigger fetchFathomParams
      dispatch(loadNotificationsFromFathomToken()) // which will load the assessments
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
    let w3 = getState().web3
    let accounts = await w3.eth.getAccounts()
    console.log('accounts')
    console.log(accounts)
    if (accounts.length === 0) {
      dispatch(receiveVariable('userAddress', 'pleaseEnterPasswordToUnblockMetamask'))
    } else {
      dispatch(receiveVariable('userAddress', accounts[0]))
      dispatch(fetchAHABalance())
    }
  }
}

export function fetchAHABalance () {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    let userAddress = getState().userAddress
    let networkID = await w3.eth.net.getId()
    const ahaABI = require('../contracts/FathomToken.json')
    const ahaContract = await new w3.eth.Contract(ahaABI.abi, ahaABI.networks[networkID].address)
    let userBalance = await ahaContract.methods.balanceOf(userAddress).call()
    console.log('userBalance')
    console.log(userBalance)
    dispatch(receiveVariable('balance', userBalance))
  }
}

//* *********************** Imma keepthose two functions for reference and decide later if get rid of them **************************************
//* *********************** the used function are under them **************************************

// uses web3.eth.Contract to instanciate a contract from it's name and network (using contracts folder built from truffle)
// in use rn
export function loadContractInstance (contractName, address) {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    let accounts = await w3.eth.getAccounts()

    try {
      var metaAbi = require('../contracts/' + contractName + '.json')
      var abi = metaAbi.abi
      let networkID = await w3.eth.net.getId()
      dispatch(receiveVariable('networkID', networkID))
      var contractAddress = address || metaAbi.networks[networkID].address
    } catch (e) {
      console.error(e)
    }

    // the web3 way
    const contractInstance = await new w3.eth.Contract(abi, contractAddress, {from: accounts[0]})
    dispatch(receiveVariable(contractName, contractInstance))

    // after instanciating the contract, trigger some side effects/functions (@observable)
    if (contractName === 'ConceptRegistry') {
      dispatch(fetchFathomParams())
    }
  }
}

// list all events of a contract Instance
export function loadContractEvents (contractInstance, eventName) {
  return async (dispatch) => {
    let pastevents = await contractInstance.getPastEvents({fromBlock: 0, toBlock: 'latest'})
    let filteredEvents = pastevents.filter((e) => {
      return (e.event === eventName)
    })
    if (eventName === 'ConceptCreation') {
      dispatch(receiveVariable(eventName, filteredEvents))
    } else {
      dispatch(receiveVariable(eventName, filteredEvents))
    }
  }
}
//* *****************************************************************************************************************

// this is if we use AssessmentCreation events from the concepts
// not being user rn
export function loadAssessmentsFromConceptRegistery () {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    let accounts = await w3.eth.getAccounts()

    try {
      var metaAbi = require('../contracts/ConceptRegistry.json')
      var abi = metaAbi.abi
      let networkID = await w3.eth.net.getId()
      var contractAddress = metaAbi.networks[networkID].address
    } catch (e) {
      console.error(e)
    }
    // instanciate Concept registery Contract
    const contractInstance = await new w3.eth.Contract(abi, contractAddress, {from: accounts[0]})
    let pastevents = await contractInstance.getPastEvents({fromBlock: 0, toBlock: 'latest'})
    let filteredEvents = pastevents.filter((e) => {
      return (e.event === 'ConceptCreation')
    })
    console.log(filteredEvents)
  }
}

// this is if we use Notifications from the FathomToken contract  ==> thats what we'll use for now
export function loadNotificationsFromFathomToken () {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    let accounts = await w3.eth.getAccounts()

    try {
      var metaAbi = require('../contracts/FathomToken.json')
      var abi = metaAbi.abi
      let networkID = await w3.eth.net.getId()
      var contractAddress = metaAbi.networks[networkID].address
    } catch (e) {
      console.error(e)
    }
    // instanciate Concept registery Contract
    const contractInstance = await new w3.eth.Contract(abi, contractAddress, {from: accounts[0]})
    let pastevents = await contractInstance.getPastEvents({fromBlock: 0, toBlock: 'latest'})
    let filteredEvents = pastevents.filter((e) => {
      return (e.event === 'Notification')
    })
    dispatch(receiveVariable('notifications', filteredEvents))
    dispatch(getAssessmentsFromNotifications(filteredEvents))
  }
}

export function getAssessmentsFromNotifications (notifications) {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    // select creationNotifications who have topic===0
    let creationNotifications = notifications.filter((n) => {
      return (n.returnValues.topic && n.returnValues.topic === '0')
    })
    // map their addresses
    let listOfAssessmentAddresses = creationNotifications.map((n) => {
      return n.returnValues.sender
    })
    var assessment = require('../contracts/Assessment.json')
    var concept = require('../contracts/Concept.json')
    let assessmentList = []
    listOfAssessmentAddresses.forEach(async (address) => {
      // get info from assessment
      let assessmentInstance = new w3.eth.Contract(assessment.abi, address)
      let cost = await assessmentInstance.methods.cost().call()
      let size = await assessmentInstance.methods.size().call()
      let stage = await assessmentInstance.methods.assessmentStage().call()
      let assessee = await assessmentInstance.methods.assessee().call()
      let conceptAddress = await assessmentInstance.methods.concept().call()
      // list assessors
      let stage2Notifications = notifications.filter((n) => {
        return (n.returnValues.topic && n.returnValues.topic === '2' &&
            n.returnValues.sender && n.returnValues.sender === address)
      })
      let assessors = stage2Notifications.map((n) => {
        return n.returnValues.user
      })
      // get info from associated concept
      let conceptInstance = new w3.eth.Contract(concept.abi, conceptAddress)
      let conceptData = await conceptInstance.methods.data().call()
      if (conceptData) {
        conceptData = Buffer.from(conceptData.slice(2), 'hex').toString('utf8')
      } else {
        conceptData = 'No Data in this Concept'
      }
      // push the final object
      let assmnt = {
        address: address,
        cost: cost,
        size: size,
        assessee: assessee,
        stage: stage,
        conceptAddress: conceptAddress,
        conceptData: conceptData,
        assessors: assessors
      }
      // for stage 1 (Called As A Potential Assessor), list all potential assessors from notifications
      if (stage === '1') {
        let stage1Notifications = notifications.filter((n) => {
          return (n.returnValues.topic && n.returnValues.topic === '1' &&
            n.returnValues.sender && n.returnValues.sender === address)
        })
        let potAssessors = stage1Notifications.map((n) => {
          return n.returnValues.user
        })
        assmnt.potAssessors = potAssessors
      }
      assessmentList.push(assmnt)
      if (assessmentList.length === listOfAssessmentAddresses.length) {
        dispatch(receiveVariable('assessmentList', assessmentList))
      }
    })
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

// reading all variables from the chain
// needs coneptRegistry to be instanciated first
export const fetchFathomParams = () => {
  return async (dispatch, getState) => {
    let cRegInstance = getState().ConceptRegistry
    let mew = await cRegInstance.methods.mewAddress().call()
    dispatch(receiveVariable('mewAddress', mew))
  }
}

export const actions = {
  web3Connect
}
