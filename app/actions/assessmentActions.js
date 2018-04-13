export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
export const RECEIVE_ASSESSORS = 'RECEIVE_ASSESSORS'
export const SET_ASSESSMENT = 'SET_ASSESSMENT'

var ethereumjsABI = require('ethereumjs-abi')
export function hashScoreAndSalt (_score, _salt) {
  return '0x' + ethereumjsABI.soliditySHA3(
    ['int128', 'string'],
    [_score, _salt]
  ).toString('hex')
}

// ============== async actions ===================

export function confirmAssessor (address) {
	return async (dispatch, getState) => {
	  let w3 = getState().ethereum.web3
	  let userAddress = getState().ethereum.userAddress
	  // instanciate Concept Contract
	  try {
	    var assessmentArtifact = require('../../build/contracts/Assessment.json')
	    var abi = assessmentArtifact.abi
	  } catch (e) {
	    console.error(e)
	  }
	  let assessmentInstance = await new w3.eth.Contract(abi, address)
    // / this is were a status should be set to "pending...""
    console.log('sdfsdfs')
	  let tx = await assessmentInstance.methods.confirmAssessor().send({from: userAddress, gas: 3200000})
	  console.log(tx)
  }
}

export function commit (address, score, salt) {
	return async (dispatch, getState) => {
	  let w3 = getState().ethereum.web3
	  let userAddress = getState().ethereum.userAddress
	  // instantiate Concept Contract
	  try {
	    var assessmentArtifact = require('../../build/contracts/Assessment.json')
	    var abi = assessmentArtifact.abi
	  } catch (e) {
	    console.error(e)
	  }
	  let assessmentInstance = await new w3.eth.Contract(abi, address)
    // this is were a status should be set to "pending...""
    // also salt should be saved in state
	  let tx = await assessmentInstance.methods.commit(
      hashScoreAndSalt(score, salt)
    ).send({from: userAddress, gas: 3200000})
	  console.log(tx)
  }
}

export function reveal (address, score, salt) {
	return async (dispatch, getState) => {
	  let w3 = getState().ethereum.web3
	  let userAddress = getState().ethereum.userAddress
	  // instanciate Concept Contract
	  try {
	    var assessmentArtifact = require('../../build/contracts/Assessment.json')
	    var abi = assessmentArtifact.abi
	  } catch (e) {
	    console.error(e)
	  }
	  let assessmentInstance = await new w3.eth.Contract(abi, address)
    // / this is were a status should be set to "pending...""
	  let tx = await assessmentInstance.methods.reveal(score, salt).send({from: userAddress, gas: 3200000})
	  console.log(tx)
  }
}

export function fetchAssessmentData (address) {
  return async (dispatch, getState) => {
    let w3 = getState().ethereum.web3
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

// reads all staked assessors from event-logs and reads their stage from the chain
// if the assessment is in the calling phase one also checks whether the user has been called
// and if, so he will be added to the list of assessors with his stage set to 1
export function fetchAssessors (address, stage) {
  return async (dispatch, getState) => {
    let w3 = getState().ethereum.web3
    let networkID = getState().ethereum.networkID
    let userAddress = getState().ethereum.userAddress
    try {
      // reading assessors from events
      const fathomTokenArtifact = require('../../build/contracts/FathomToken.json')
      const fathomTokenInstance = new w3.eth.Contract(fathomTokenArtifact.abi, fathomTokenArtifact.networks[networkID].address)
      // NOTE: this piece is a bit tricky, as filtering in the call usually works on the local testnet, but not on rinkeby
      // for rinkeby one has to get all events and filter locally
      let pastEvents = await fathomTokenInstance.getPastEvents({fromBlock:0, toBlock:"latest"})
      // console.log('pastEvents ',pastEvents )
      if (pastEvents.length === []) {
        console.log('weirdly no Notifications events have been found. Try switching Metamasks network back and forth')
      }
      let assessors = []
      let stakedEvents = pastEvents.filter(e =>
                                           e.event == 'Notification' &&
                                           e.returnValues['sender'] === address &&
                                           e.returnValues['topic'] === '2' &&
                                           assessors.push(e.returnValues['user'])
                                          )
      // console.log('asessors after looking for staked Events ', assessors )
      dispatch(fetchAssessorStages(address, assessors, stage==='1'))
    } catch(e) {
      console.log('ERROR: fetching assessors from the events did not work!', e)
    }
  }
}

export function fetchAssessorStages (address, assessors, checkUserAddress=false) {
	return async (dispatch, getState) => {
    console.log('entered')
	  let w3 = getState().ethereum.web3
	  // instanciate Concept Contract
	  try {
	    var assessmentArtifact = require('../../build/contracts/Assessment.json')
	    var abi = assessmentArtifact.abi
	  } catch (e) {
	    console.error(e)
	  }
	  let assessmentInstance = await new w3.eth.Contract(abi, address)
    let assessorStages = []
    for (let i=0; i<assessors.length; i++) {
      let stage = await assessmentInstance.methods.assessorState(assessors[i]).call()
      assessorStages.push({address: assessors[i], stage: stage})
    }
    if (checkUserAddress) {
	    let userAddress = getState().ethereum.userAddress
      let userStage = await assessmentInstance.methods.assessorState(userAddress).call()
      if (userStage === '1') {
        assessorStages.push({address: userAddress, stage: userStage})
      }
    }
    dispatch(receiveAssessors(address, assessorStages))
  }
}

// ============== sync actions ===================

export function receiveAssessors (address, assessors) {
  return {
    type: RECEIVE_ASSESSORS,
    address,
    assessors
  }
}

export function receiveAssessment(assessment) {
  return {
    type: RECEIVE_ASSESSMENT,
    assessment
  }
}

export function setAssessment (address) {
  return {
    type: SET_ASSESSMENT,
    address
  }
}
