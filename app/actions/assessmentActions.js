import { Stage, getInstance } from './utils.js'

export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
export const RECEIVE_FINALSCORE = 'RECEIVE_FINALSCORE'
export const RECEIVE_STORED_DATA = 'RECEIVE_STORED_DATA'
export const RECEIVE_ASSESSMENTSTAGE = 'RECEIVE_ASSESSMENTSTAGE'
export const REMOVE_ASSESSMENT = 'REMOVE_ASSESSMENT'
export const RECEIVE_ASSESSORS = 'RECEIVE_ASSESSORS'

const ethereumjsABI = require('ethereumjs-abi')

export function hashScoreAndSalt (_score, _salt) {
  return '0x' + ethereumjsABI.soliditySHA3(
    ['int128', 'string'],
    [_score, _salt]
  ).toString('hex')
}

// ============== async actions ===================

export function confirmAssessor (address) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    // / this is were a status should be set to "pending...""
    let tx = await assessmentInstance.methods.confirmAssessor().send({from: userAddress, gas: 3200000})
    console.log(tx)
  }
}

export function commit (address, score, salt) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
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
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    // / this is were a status should be set to "pending...""
    let tx = await assessmentInstance.methods.reveal(score, salt).send({from: userAddress, gas: 3200000})
    console.log(tx)
  }
}

export function storeData (address, data) {
  return async (dispatch, getState) => {
    console.log('storead', address)
    dispatch(receiveStoredData(address, data + ' (not yet mined)'))
    dispatch(storeDataOnAssessment(address, data))
  }
}

export function storeDataOnAssessment (address, data) {
  return async (dispatch, getState) => {
    console.log('dispatching to storedata to contract', data)
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    // this is were a status should be set to "pending...""
    // also salt should be saved in state
    let tx = await assessmentInstance.methods.addData(data).send({from: userAddress, gas: 3200000})
    console.log(tx)
  }
}

// fetch assessment data for one given assessment
export function fetchAssessmentData (address) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    try {
      let assessmentInstance = getInstance.assessment(getState(), address)
      let cost = await assessmentInstance.methods.cost().call()
      let size = await assessmentInstance.methods.size().call()
      let stage = Number(await assessmentInstance.methods.assessmentStage().call())
      // let finalScore = await assessmentInstance.methods.finalScore().call()
      let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
      let assessee = await assessmentInstance.methods.assessee().call()
      let conceptAddress = await assessmentInstance.methods.concept().call()

      // get data from associated concept
      let conceptInstance = getInstance.concept(getState(), conceptAddress)
      let conceptData = await conceptInstance.methods.data().call()
      if (conceptData) {
        conceptData = Buffer.from(conceptData.slice(2), 'hex').toString('utf8')
      } else {
        conceptData = ''
        console.log('was undefined: conceptData ', conceptData)
      }
      dispatch(receiveAssessment({
        address,
        cost,
        size,
        assessee,
        userStage,
        stage,
        conceptAddress,
        conceptData
      }))
    } catch (e) {
      console.log('reading assessment-data from the chain did not work for assessment: ', address, e)
      // TODO how to end this in case of error?
    }
  }
}

export function fetchScoreAndPayout (address) {
  return async (dispatch, getState) => {
    try {
      let assessmentInstance = getInstance.assessment(getState(), address)
      let finalScore = await assessmentInstance.methods.finalScore().call()

      dispatch(receiveFinalScore({
        address,
        finalScore
      }))
    } catch (e) {
      console.log('reading assessment-data from the chain did not work for assessment: ', address, e)
    }
  }
}

// fetches Data for particpants of the assessment as well as the stages of the assessors
export function fetchAssessmentViewData (address, stage) {
  return async (dispatch, getState) => {
    dispatch(fetchAssessors(address, stage))
    dispatch(fetchStoredData(address))
  }
}

// reads all staked assessors from event-logs and reads their stage from the chain
// if the assessment is in the calling phase one also checks whether the user has been called
// and if, so he will be added to the list of assessors with his stage set to 1
export function fetchAssessors (address, stage) {
  return async (dispatch, getState) => {
    try {
      // reading assessors from events
      const fathomTokenInstance = getInstance.fathomToken(getState())
      // NOTE: this piece is a bit tricky, as filtering in the call usually works on the local testnet, but not on rinkeby
      // for rinkeby one has to get all events and filter locally
      let pastEvents = await fathomTokenInstance.getPastEvents({fromBlock: 0, toBlock: 'latest'})
      if (pastEvents.length === []) {
        console.log('Oddly no Notifications events have been found. Try switching Metamasks network back and forth')
      }
      let assessors = []
      pastEvents.filter(
        e =>
          e.event === 'Notification' &&
          e.returnValues['sender'] === address &&
          e.returnValues['topic'] === '2' &&
          assessors.push(e.returnValues['user'])
      )
      // console.log('asessors after looking for staked Events ', assessors )
      dispatch(fetchAssessorStages(address, assessors, stage === 1))
    } catch (e) {
      console.log('ERROR: fetching assessors from the events did not work!', e)
    }
  }
}
// returns the strings that are stored on the assessments
// for now, only the data stored by the assessee
export function fetchStoredData (address) {
  return async (dispatch, getState) => {
    let assessmentInstance = getInstance.assessment(getState(), address)
    let assessee = await assessmentInstance.methods.assessee().call()
    let data = await assessmentInstance.methods.data(assessee).call()
    dispatch(receiveStoredData(address, data))
  }
}

// let assessors = getState().assessments[address].assessors || []
// let data = {}
// for (let i = 0; i < assessors.length; i++) {
// data[assessors[i]] = await assessmentInstance.methods.data(assessors[i]).call()
// }

export function fetchAssessorStages (address, assessors, checkUserAddress = false) {
  return async (dispatch, getState) => {
    let assessmentInstance = getInstance.assessment(getState(), address)
    let assessorStages = []
    for (let i = 0; i < assessors.length; i++) {
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

export function fetchLatestAssessments () {
  return async (dispatch, getState) => {
    // get State data
    let userAddress = getState().ethereum.userAddress

    // get notification events from fathomToken contract
    const fathomTokenInstance = getInstance.fathomToken(getState())
    let pastNotifications = await fathomTokenInstance.getPastEvents('Notification', {filter: {user: userAddress}, fromBlock: 0, toBlock: 'latest'})
    let assessmentAddresses = pastNotifications.reduce((accumulator, notification) => {
      let assessment = notification.returnValues.sender
      if (accumulator.indexOf(assessment) === -1) {
        accumulator.push(assessment)
      }
      return accumulator
    }, [])

    assessmentAddresses.forEach((address) => {
      dispatch(updateAssessments(address))
    })
  }
}

export function updateAssessments (address) {
  return async (dispatch, getState) => {
    let assessments = await getState().assessments
    if (Object.keys(assessments).includes(address)) {
      dispatch(updateExistingAssessment(address))
    } else {
      dispatch(fetchAssessmentData(address))
    }
  }
}

function updateExistingAssessment (address) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let oldStage = getState().assessments[address].stage

    const assessmentInstance = getInstance.assessment(getState(), address)
    let userStage = assessmentInstance.methods.assessorStages.call(userAddress)
    let assessmentStage = assessmentInstance.methods.assessmentStage.call()

    if (oldStage === Stage.Called) {
      // only keep assessment around if the user is in it
      if (userStage < Stage.Confirmed) {
        dispatch(removeAssessment(address))
      }
    }

    if (assessmentStage === Stage.Done) {
      dispatch(fetchScoreAndPayout(address))
    } else {
      dispatch(receiveAssessmentStage(address, assessmentStage))
    }
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

export function receiveStoredData (assessmentAddress, data) {
  return {
    type: RECEIVE_STORED_DATA,
    assessmentAddress,
    data
  }
}
export function receiveAssessment (assessment) {
  return {
    type: RECEIVE_ASSESSMENT,
    assessment
  }
}

export function receiveAssessmentStage (address, stage) {
  return {
    type: RECEIVE_ASSESSMENTSTAGE,
    address,
    stage
  }
}

export function receiveFinalScore (address, finalScore) {
  return {
    type: RECEIVE_ASSESSMENTSTAGE,
    address,
    finalScore
  }
}

export function removeAssessment (address) {
  return {
    type: REMOVE_ASSESSMENT,
    address
  }
}
