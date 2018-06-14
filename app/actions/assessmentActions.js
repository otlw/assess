import { getInstance, convertFromOnChainScoreToUIScore } from '../utils.js'
import { sendAndReactToTransaction } from './transActions.js'
import { Stage, LoadingStage } from '../constants.js'

export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
export const RECEIVE_FINALSCORE = 'RECEIVE_FINALSCORE'
export const RECEIVE_STORED_DATA = 'RECEIVE_STORED_DATA'
export const RECEIVE_PAYOUTS = 'RECEIVE_PAYOUTS'
export const RECEIVE_ASSESSMENTSTAGE = 'RECEIVE_ASSESSMENTSTAGE'
export const REMOVE_ASSESSMENT = 'REMOVE_ASSESSMENT'
export const RECEIVE_ASSESSORS = 'RECEIVE_ASSESSORS'
export const BEGIN_LOADING_ASSESSMENTS = 'BEGIN_LOADING_ASSESSMENTS'
export const END_LOADING_ASSESSMENTS = 'END_LOADING_ASSESSMENTS'
export const SET_ASSESSMENT = 'SET_ASSESSMENT'
export const BEGIN_LOADING_DETAIL = 'BEGIN_LOADING_DETAIL'
export const END_LOADING_DETAIL = 'END_LOADING_DETAIL'
export const RESET_LOADED_DETAILS = 'RESET_LOADED_DETAILS'

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
    // also salt should be saved in state => I put the saing part in the assessorStatus component
    sendAndReactToTransaction(
      dispatch,
      {method: assessmentInstance.methods.confirmAssessor, args: []},
      Stage.Called,
      userAddress,
      address
    )
  }
}

export function commit (address, score, salt) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    sendAndReactToTransaction(
      dispatch,
      {method: assessmentInstance.methods.commit, args: [hashScoreAndSalt(score, salt)]},
      Stage.Confirmed,
      userAddress,
      address
    )
  }
}

export function reveal (address, score, salt) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    sendAndReactToTransaction(
      dispatch,
      {method: assessmentInstance.methods.reveal, args: [score, salt]},
      Stage.Committed,
      userAddress,
      address
    )
  }
}

export function storeData (address, data) {
  return async (dispatch, getState) => {
    dispatch(storeDataOnAssessment(address, data))
  }
}

export function storeDataOnAssessment (address, data) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    // also salt should be saved in state
    let dataAsBytes = getState().ethereum.web3.utils.utf8ToHex(data)
    sendAndReactToTransaction(
      dispatch,
      {method: assessmentInstance.methods.addData, args: [dataAsBytes]},
      'meetingPointChange',
      userAddress,
      address
      // either put back fetchStoredData that was deprecated in favor of fetchAssessmentData, or use fetchAssessmentData
      // {method: fetchStoredData, args: [address]}
    )
  }
}

// fetch assessment data for one given assessment
// if that assessment is already in state, it only fetches what could have changed (stage)
export function fetchAssessmentData (assessmentAddress) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let address = assessmentAddress || getState().assessments.selectedAssessment
    if (getState().assessments[address]) {
      let assessmentInstance = getInstance.assessment(getState(), address)
      let stage = Number(await assessmentInstance.methods.assessmentStage().call())
      if (stage !== getState().assessments[address].stage) {
        dispatch(receiveAssessmentStage(address, stage))
      }
      // mark info as loaded
      dispatch(endLoadingDetail('info'))
    } else {
      dispatch(beginLoadingDetail('info'))
      try {
        let assessmentInstance = getInstance.assessment(getState(), address)

        // get assessment infos
        let cost = await assessmentInstance.methods.cost().call()
        let endTime = await assessmentInstance.methods.endTime().call()
        // checkpoint -> keeps track of timelimits for 1) latest possible time to confirm and 2) earliest time to reveal
        let checkpoint = await assessmentInstance.methods.checkpoint().call()
        let size = await assessmentInstance.methods.size().call()
        let stage = Number(await assessmentInstance.methods.assessmentStage().call())
        let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
        let assessee = await assessmentInstance.methods.assessee().call()
        let conceptAddress = await assessmentInstance.methods.concept().call()

        // convert score to Front End range (FE:0,100%; BE:-100,100)
        let onChainScore = Number(await assessmentInstance.methods.finalScore().call())
        let finalScore = convertFromOnChainScoreToUIScore(onChainScore)

        // get the data (meeting point) and convert it from bytes32 to string
        let data = 'no meeting point set'
        let bytesData = await assessmentInstance.methods.data(assessee).call()
        if (bytesData) {
          data = getState().ethereum.web3.utils.hexToUtf8(bytesData)
        }

        // get conceptRegistry instance to verify assessment/concept/conceptRegistry link authenticity
        let conceptRegistryInstance = getInstance.conceptRegistry(getState())
        let isValidConcept = await conceptRegistryInstance.methods.conceptExists(conceptAddress).call()

        // check if assessment is from concept
        let conceptInstance = getInstance.concept(getState(), conceptAddress)
        let isValidAssessment = await conceptInstance.methods.assessmentExists(address).call()

        // if concept is from Registry and assessment is from concept,
        // go ahead and fetch data, otherwise, add an invalid assessment object
        if (isValidConcept && isValidAssessment) {
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
            checkpoint,
            endTime,
            size,
            assessee,
            userStage,
            stage,
            finalScore,
            conceptAddress,
            conceptData,
            data,
            valid: true
          }))
        } else {
          // if the concept is not linked to concept Registry
          dispatch(receiveAssessment({
            address: address,
            valid: false
          }))
        }
      } catch (e) {
        console.log('reading assessment-data from the chain did not work for assessment: ', address, e)
        // In case of error, we assume the assessment address is invalid
        // conceptData will be used to detect wrong address situation (but could be any other field)
      }
      dispatch(endLoadingDetail('info'))
    }
  }
}

export function fetchScoreAndPayout (address) {
  return async (dispatch, getState) => {
    try {
      let assessmentInstance = getInstance.assessment(getState(), address)

      // convert score to Front End range (FE:0,100%; BE:-100,100)
      let onChainScore = Number(await assessmentInstance.methods.finalScore().call())
      let finalScore = convertFromOnChainScoreToUIScore(onChainScore)

      dispatch(receiveFinalScore({
        address,
        finalScore
      }))
    } catch (e) {
      console.log('reading assessment-data from the chain did not work for assessment: ', address, e)
    }
  }
}

// export function updateAssessment (address) {
//   return async (dispatch, getState) => {
//   }
// }

// reads all staked assessors from event-logs and reads their stage from the chain
// if the assessment is in the calling phase one also checks whether the user has been called
// and if, so he will be added to the list of assessors with his stage set to 1
export function fetchAssessors (selectedAssessment) {
  return async (dispatch, getState) => {
    try {
      let address = selectedAssessment || getState().assessments.selectedAssessment
      dispatch(beginLoadingDetail('assessors'))
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
      let stage = Number(getState().assessments[address].stage)
      dispatch(fetchAssessorStages(address, assessors, Number(stage) === Stage.Called))
      if (stage === Stage.Done) {
        dispatch(fetchAllPayouts(address))
      }
    } catch (e) {
      console.log('ERROR: fetching assessors from the events did not work!', e)
    }
  }
}

// reads all transfers an assessments to users from event-logs
export function fetchAllPayouts (address) {
  return async (dispatch, getState) => {
    dispatch(beginLoadingDetail('payouts'))
    try {
      // reading assessors-payouts from events
      const fathomTokenInstance = getInstance.fathomToken(getState())
      // NOTE: this piece is a bit tricky, as filtering in the call usually works on the local testnet, but not on rinkeby
      // for rinkeby one has to get all events and filter locally
      let pastEvents = await fathomTokenInstance.getPastEvents({fromBlock: 0, toBlock: 'latest'})
      if (pastEvents.length === []) {
        console.log('Oddly no Notifications events have been found. Try switching Metamasks network back and forth')
      }
      let payouts = {}
      pastEvents.filter(
        e =>
          e.event === 'Transfer' &&
          e.returnValues['_from'] === address &&
          (payouts[e.returnValues['_to']] = e.returnValues['_value'])
      )
      dispatch(receivePayouts(address, payouts))
    } catch (e) {
      console.log('ERROR: fetching payouts from the events did not work!', e)
    }
    dispatch(endLoadingDetail('payouts'))
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
      let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
      if (userStage === Stage.Called) {
        assessorStages.push({address: userAddress, stage: userStage})
      }
    }
    dispatch(receiveAssessors(address, assessorStages))
    dispatch(endLoadingDetail('assessors'))
  }
}

// part of fetchAssessmentData now

// returns the strings that are stored on the assessments
// for now, only the data stored by the assessee

// export function fetchStoredData (selectedAssessment) {
//   console.log('fetchStoredData', selectedAssessment)
//   return async (dispatch, getState) => {
//     dispatch(beginLoadingDetail('attachments'))
//     let address = selectedAssessment || getState().assessments.selectedAssessment
//     let assessmentInstance = getInstance.assessment(getState(), address)
//     let assessee = await assessmentInstance.methods.assessee().call()
//     let data = await assessmentInstance.methods.data(assessee).call()
//     dispatch(receiveStoredData(address, data))
//     dispatch(endLoadingDetail('attachments'))
//   }
// }

export function fetchLatestAssessments () {
  return async (dispatch, getState) => {
    if (getState().loading.assessments === LoadingStage.None) {
      // get State data
      let userAddress = getState().ethereum.userAddress
      dispatch(beginLoadingAssessments())

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
      dispatch(endLoadingAssessments())
    } else {
      // TODO
      // console.log('do not fetch all again')
    }
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
    let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
    let assessmentStage = Number(await assessmentInstance.methods.assessmentStage().call())

    // if the assessment is no longer available to the user:
    if (oldStage === Stage.Called &&
        assessmentStage > Stage.Called &&
        userStage < Stage.Confirmed) {
      dispatch(removeAssessment(address))
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

export function receivePayouts (assessmentAddress, payouts) {
  return {
    type: RECEIVE_PAYOUTS,
    assessmentAddress,
    payouts
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

export function beginLoadingAssessments () {
  return {
    type: BEGIN_LOADING_ASSESSMENTS
  }
}

export function endLoadingAssessments () {
  return {
    type: END_LOADING_ASSESSMENTS
  }
}

export function beginLoadingDetail (detail) {
  return {
    type: BEGIN_LOADING_DETAIL,
    detail
  }
}

export function endLoadingDetail (detail) {
  return {
    type: END_LOADING_DETAIL,
    detail
  }
}

export function setAssessment (address) {
  return {
    type: SET_ASSESSMENT,
    address
  }
}

export function resetLoadedDetails () {
  return {
    type: RESET_LOADED_DETAILS
  }
}
