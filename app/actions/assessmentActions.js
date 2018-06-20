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
export const RECEIVE_ASSESSOR = 'RECEIVE_ASSESSOR'
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
      // TODO let's not forget to handle this after we decide about fetchStoredData
      // {method: fetchStoredData, args: [address]}
    )
  }
}

/*
  fetches all data for all assessments (static, dynamic info & assessor-related info)
*/
export function fetchLatestAssessments () {
  return async (dispatch, getState) => {
    if (getState().loading.assessments === LoadingStage.None) { // only do this once
      console.log('fetchLatestAssessments ')
      let userAddress = getState().ethereum.userAddress
      dispatch(beginLoadingAssessments())

      // get notification events from fathomToken contract
      const fathomTokenInstance = getInstance.fathomToken(getState())
      let pastNotifications = await fathomTokenInstance.getPastEvents('Notification', {
        fromBlock: 0,
        toBlock: 'latest'
      })
      let assessmentAddresses = pastNotifications.reduce((accumulator, notification) => {
        let assessment = notification.returnValues.sender
        // save all addressess where the user is involved
        if (notification.returnValues.user === userAddress && accumulator.indexOf(assessment) === -1) {
          accumulator.push(assessment)
        }
        return accumulator
      }, [])

      dispatch(endLoadingAssessments())
      // Add assessors to assessments, if
      // either the user has been called OR
      // the assessment is one, where the user is involved as assessee
      for (let notification of pastNotifications) {
        let event = notification.returnValues
        if (event.topic === '2' &&
            (event.user === userAddress ||
             assessmentAddresses.indexOf(event.sender > -1))) {
          dispatch(receiveAssessor(event.sender, event.user))
        }
      }

      // fetch data for assessments
      assessmentAddresses.forEach((address) => {
        dispatch(fetchAssessmentData(address))
      })
    }
  }
}

/*
  validates whether or not an assessment in the assessmentView is from a legal
  concept which also knows about the assessment
*/
export function validateAndFetchAssessmentData () {
  return async (dispatch, getState) => {
    let address = getState().assessments.selectedAssessment
    try {
      let assessmentInstance = getInstance.assessment(getState(), address)
      // get conceptRegistry instance to verify assessment/concept/conceptRegistry link authenticity
      let conceptAddress = await assessmentInstance.methods.concept().call()
      let conceptRegistryInstance = getInstance.conceptRegistry(getState())
      let isValidConcept = await conceptRegistryInstance.methods.conceptExists(conceptAddress).call()
      // check if assessment is from concept
      let conceptInstance = getInstance.concept(getState(), conceptAddress)
      let isValidAssessment = await conceptInstance.methods.assessmentExists(address).call()
      // if concept is from Registry and assessment is from concept,
      // go ahead and fetch data, otherwise, add an invalid assessment object
      if (isValidConcept && isValidAssessment) {
        dispatch(fetchAssessmentData(address))
      } else {
        dispatch(setAssessment('invalid'))
      }
    } catch (e) {
      console.log('error trying tovalidate assessment: ', e)
      dispatch(setAssessment('invalid'))
    }
  }
}

/*
  fetch assessment data for one given assessment if the basic assessment-Data
 is already in state (), it only fetches what could have changed via updateAssessment
 */
export function fetchAssessmentData (address) {
  return async (dispatch, getState) => {
    if (!getState().assessments[address] || !getState().assessments[address].assessee) {
      dispatch(beginLoadingDetail('info'))
      try {
        // get static assessment info
        let assessmentInstance = getInstance.assessment(getState(), address)
        let cost = await assessmentInstance.methods.cost().call()
        let endTime = await assessmentInstance.methods.endTime().call()
        // checkpoint -> keeps track of timelimits for 1) latest possible time to confirm and 2) earliest time to reveal
        let checkpoint = await assessmentInstance.methods.checkpoint().call()
        let size = await assessmentInstance.methods.size().call()
        let assessee = await assessmentInstance.methods.assessee().call()
        let conceptAddress = await assessmentInstance.methods.concept().call()
        let conceptInstance = getInstance.concept(getState(), conceptAddress)
        let conceptData = await conceptInstance.methods.data().call()
        if (conceptData) {
          conceptData = Buffer.from(conceptData.slice(2), 'hex').toString('utf8')
        } else {
          conceptData = ''
          console.log('was undefined: conceptData ', conceptData)
        }
        // send static info to store
        dispatch(receiveAssessment({
          address,
          cost,
          checkpoint,
          endTime,
          size,
          assessee,
          conceptAddress,
          conceptData
        }))
      } catch (e) {
        console.log('reading assessment-data from the chain did not work for assessment: ', address, e)
      }
    }
    // get dynamic Stuff
    dispatch(updateAssessment(address))
  }
}

/*
  fetches stuff that can change (stage, userStage, meeting Point) and dependent on
  the previous value of those also (userPayout, finalScore). Also, it uses
  updateAssessors(address, stage) to fetch the latest changes concerning the
  assessors
*/
export function updateAssessment (address) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    let stage = Number(await assessmentInstance.methods.assessmentStage().call())
    let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
    let assessee = await assessmentInstance.methods.assessee().call()

    let finalScore
    if (stage === Stage.Done) {
      let onChainScore = Number(await assessmentInstance.methods.finalScore().call())
      // convert score to Front End range (FE:0,100%; BE:-100,100)
      finalScore = convertFromOnChainScoreToUIScore(onChainScore)
      if (userAddress !== assessee) {
        dispatch(fetchPayouts(address, userAddress))
      }
    }

    // get the data (meeting point) and convert it from bytes32 to string
    let data = 'no meeting point set'
    let bytesData = await assessmentInstance.methods.data(assessee).call()
    if (bytesData) {
      data = getState().ethereum.web3.utils.hexToUtf8(bytesData)
    }
    dispatch(receiveAssessment({
      address,
      stage,
      userStage,
      finalScore,
      data
    }))
    dispatch(endLoadingDetail('info'))
    if (getState().assessments.selectedAssessment === address) {
      console.log('updating assesors from updateassessment')
      dispatch(updateAssessors(address, false, stage === Stage.Called))
    }
  }
}

/*
  This is the loading-function for the AssessorList-component. It will only fetch Assessors
  if those have not been loaded already from the Dashboard.
  If there are no assessors, it reads all staked assessors from event-logs.
  Then updates them by calling updateAssessors
  @param assessmentAddress address to be updated. If none is given it will use the one in the active view
*/
export function fetchAssessors () {
  return async (dispatch, getState) => {
    // only do this if assessors have not already been loaded when the dashboard was visited
    dispatch(beginLoadingDetail('assessors'))
    if (getState().loading.assessments === LoadingStage.None) {
      let address = getState().assessments.selectedAssessment
      try {
        const fathomTokenInstance = getInstance.fathomToken(getState())
        let pastEvents = await fathomTokenInstance.getPastEvents('Notification', {
          filter: {sender: address, topic: 2},
          fromBlock: 0,
          toBlock: 'latest'
        })
        let assessors = pastEvents.map(x => x.returnValues.user)
        // }
        let stage = Number(getState().assessments[address].stage)
        console.log('updateAssessors from fetchASsessor')
        dispatch(updateAssessors(address, assessors, Number(stage) === Stage.Called))
      } catch (e) {
        console.log('ERROR: fetching assessors for assessment ', address, ' from the events did not work!', e)
      }
    } else {
      console.log('not fetching assesssors, because the dashoard was visited previously')
    }
  }
}
/*
  updates a given list of assessors by fetching their stages and (if necessary)
  payouts.
  @param assessorAddresses assessors to be updated, if no assessors are given, the one saved in the assessment will be used
  @param checkUserAddress also checks whether the user has been called and if, so he will be added to the list of assessors with his stage set to 1
*/
export function updateAssessors (address, assessorAddresses = false, checkUserAddress = false) {
  return async (dispatch, getState) => {
    let assessmentInstance = getInstance.assessment(getState(), address)
    let assessors = assessorAddresses || (getState().assessments[address].assessorStages ? Object.keys(getState().assessments[address].assessorStages) : '')
    let assessorStages = {}
    if (assessors) {
      for (let i = 0; i < assessors.length; i++) {
        let stage = Number(await assessmentInstance.methods.assessorState(assessors[i]).call())
        assessorStages[assessors[i]] = stage
      }
    }
    if (checkUserAddress) {
      let userAddress = getState().ethereum.userAddress
      let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
      if (userStage === Stage.Called) {
        assessorStages[userAddress] = userStage
      }
    }
    if (Object.keys(assessorStages).length > 0) {
      console.log('updateing assessors', assessorStages)
      dispatch(receiveAssessors(address, assessorStages))
      let stage = Number(getState().assessments[address].stage)
      if (stage === Stage.Done) {
        dispatch(fetchPayouts(address))
      }
    } else {
      console.log('no assessors to be updated')
    }
    dispatch(endLoadingDetail('assessors'))
  }
}

/*
  fetches the payouts of one or all assessors of a given assessment
*/
export function fetchPayouts (address, user = false) {
  console.log('fetchPayouts')
  return async (dispatch, getState) => {
    // dispatch(beginLoadingDetail('payouts'))
    const fathomTokenInstance = getInstance.fathomToken(getState())
    let filter = {
      filter: { _from: address },
      fromBlock: 0,
      toBlock: 'latest'
    }
    if (user) {
      console.log('filtering payout for user', user)
      filter.filter['_to'] = user
    }
    let pastEvents = await fathomTokenInstance.getPastEvents('Transfer', filter)
    let payouts = {}
    pastEvents.filter(e =>
      (payouts[e.returnValues['_to']] = e.returnValues['_value'])
    )
    dispatch(receivePayouts(address, payouts))
  }
}

export function processEvent (user, sender, topic) {
  return async (dispatch, getState) => {
    if (topic <= 1) {
      dispatch(fetchAssessmentData(sender))
    }
    let userAddress = getState().ethereum.userAddress
    if (topic === 2) {
      dispatch(receiveAssessor(sender, user))
    }
    if (topic === 4 && user === userAddress) {
      dispatch(updateAssessment(sender))
    }
  }
}

export function receiveAssessors (address, assessorStages) {
  return {
    type: RECEIVE_ASSESSORS,
    address,
    assessorStages
  }
}

export function receiveAssessor (address, assessor) {
  return {
    type: RECEIVE_ASSESSOR,
    address,
    assessor
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
