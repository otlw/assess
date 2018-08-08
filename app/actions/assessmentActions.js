import { getInstance, convertFromOnChainScoreToUIScore } from '../utils.js'
import { sendAndReactToTransaction } from './transActions.js'
import { receiveVariable, fetchUserBalance } from './web3Actions.js'
import { Stage, LoadingStage, NotificationTopic } from '../constants.js'

export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
export const REMOVE_ASSESSMENT = 'REMOVE_ASSESSMENT'
export const RECEIVE_ASSESSOR = 'RECEIVE_ASSESSOR'
export const BEGIN_LOADING_ASSESSMENTS = 'BEGIN_LOADING_ASSESSMENTS'
export const END_LOADING_ASSESSMENTS = 'END_LOADING_ASSESSMENTS'
export const SET_ASSESSMENT_AS_INVALID = 'SET_ASSESSMENT_AS_INVALID'
export const UPDATE_ASSESSMENT_VARIABLE = 'UPDATE_ASSESSMENT_VARIABLE'

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
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.confirmAssessor().send({from: userAddress}) },
      Stage.Called,
      userAddress,
      address,
      () => { dispatch(fetchUserStage(address)) }
    )
  }
}

export function commit (address, score, salt) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.commit(hashScoreAndSalt(score, salt)).send({from: userAddress}) },
      Stage.Confirmed,
      userAddress,
      address,
      () => { dispatch(fetchUserStage(address)) }
    )
  }
}

export function reveal (address, score, salt) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.reveal(score, salt).send({from: userAddress}) },
      Stage.Committed,
      userAddress,
      address,
      () => { dispatch(fetchUserStage(address)) }
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
      () => { return assessmentInstance.methods.addData(dataAsBytes).send({from: userAddress}) },
      'meetingPointChange',
      userAddress,
      address,
      () => { dispatch(fetchStoredData(address)) }
    )
  }
}

/*
  Called ONLY ONCE via the loading-hoc of FilterView-component.
  Fetches all data for all assessments (static, dynamic info & assessor-related info)
  and sorts staked assessors to assessments.
*/
export function fetchLatestAssessments () {
  return async (dispatch, getState) => {
    if (getState().loading.assessments === LoadingStage.None) { // only do this once
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

      dispatch(receiveVariable('userAssessments', assessmentAddresses))

      // fetch data for assessments
      assessmentAddresses.forEach((address) => {
        dispatch(fetchAssessmentData(address))
      })
      dispatch(endLoadingAssessments())
    }
  }
}

/*
  Called via the loading-hoc of AssessmentData.js, every time the assessmentView is mounted.
  Validates whether or not an assessment in the assessmentView is from a legal
  concept which also knows about the assessment, and if so
  calls fetchAssessmentData()
*/
export function validateAndFetchAssessmentData (address) {
  return async (dispatch, getState) => {
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
        dispatch(setAssessmentAsInvalid(address))
      }
    } catch (e) {
      console.log('error trying tovalidate assessment: ', e)
      dispatch(setAssessmentAsInvalid(address))
    }
  }
}

/*
  Fetch assessment data for one given assessment. If the basic assessment-Data
 is already in state (), it only fetches what could have changed via
 updateAssessment()
 */
export function fetchAssessmentData (address) {
  return async (dispatch, getState) => {
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
      let stage = Number(await assessmentInstance.methods.assessmentStage().call())

      let conceptDataHex = await conceptInstance.methods.data().call()
      let conceptData = Buffer.from(conceptDataHex.slice(2), 'hex').toString('utf8')

      // Dynamic Info
      let done = Number(await assessmentInstance.methods.done().call())
      let userAddress = getState().ethereum.userAddress
      let userStage = (userAddress !== assessee) ? Number(await assessmentInstance.methods.assessorState(userAddress).call()) : 0

      let dataBytes = await assessmentInstance.methods.data(assessee).call()
      let data = dataBytes ? getState().ethereum.web3.utils.hexToUtf8(dataBytes) : ''

      const fathomTokenInstance = getInstance.fathomToken(getState())
      let pastEvents = await fathomTokenInstance.getPastEvents('Notification', {
        filter: {sender: address, topic: 2},
        fromBlock: 0, // TODO don't use from 0
        toBlock: 'latest'
      })
      let assessors = pastEvents.map(x => x.returnValues.user)

      let finalScore, payout
      if (stage === Stage.Done) {
        let onChainScore = Number(await assessmentInstance.methods.finalScore().call())
        // convert score to Front End range (FE:0,100%; BE:-100,100)
        finalScore = convertFromOnChainScoreToUIScore(onChainScore)
        // only fetch Payout if user is not assesse and payout is not already there
        if (assessors.includes(userAddress)) {
          let filter = {
            filter: { _from: address, _to: userAddress },
            fromBlock: 0,
            toBlock: 'latest'
          }
          let pastEvents = await fathomTokenInstance.getPastEvents('Transfer', filter)
          payout = pastEvents[0].returnValues['_value']
        }
      }

      dispatch(receiveAssessment({
        address,
        cost,
        checkpoint,
        stage,
        userStage,
        endTime,
        done,
        size,
        assessee,
        conceptAddress,
        conceptData,
        finalScore,
        data,
        assessors,
        payout
      }))
    } catch (e) {
      console.log('reading assessment-data from the chain did not work for assessment: ', address, e)
    }
  }
}

/*
  fetches the payouts of one or all assessors of a given assessment
  @param: if given only fetch payout of that one single user
*/
export function fetchPayout (address, user) {
  return async (dispatch, getState) => {
    const fathomTokenInstance = getInstance.fathomToken(getState())
    let filter = {
      filter: { _from: address, _to: user },
      fromBlock: 0, // TODO Don't start from block 0
      toBlock: 'latest'
    }
    let pastEvents = await fathomTokenInstance.getPastEvents('Transfer', filter)
    let payout = pastEvents[0] ? pastEvents[0].returnValues['_value'] : undefined
    if (payout) dispatch(updateAssessmentVariable(address, 'payout', payout))
  }
}

export function fetchUserStage (address) {
  return async (dispatch, getState) => {
    let assessmentInstance = getInstance.assessment(getState(), address)
    let userAddress = getState().ethereum.userAddress
    let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
    let done = Number(await assessmentInstance.methods.done().call())
    if (getState().assessments[address].done !== done) {
      dispatch(updateAssessmentVariable(address, 'done', done))
    }
    dispatch(updateAssessmentVariable(address, 'userStage', userStage))
  }
}

export function fetchFinalScore (address) {
  return async (dispatch, getState) => {
    let assessmentInstance = getInstance.assessment(getState(), address)
    let onChainScore = Number(await assessmentInstance.methods.finalScore().call())
    // convert score to Front End range (FE:0,100%; BE:-100,100)
    let finalScore = convertFromOnChainScoreToUIScore(onChainScore)
    dispatch(updateAssessmentVariable(address, 'finalScore', finalScore))
  }
}

// part of fetchAssessmentData now

// returns the strings that are stored on the assessments
// for now, only the data stored by the assessee
export function fetchStoredData (selectedAssessment) {
  return async (dispatch, getState) => {
    let address = selectedAssessment || getState().assessments.selectedAssessment
    let assessmentInstance = getInstance.assessment(getState(), address)
    let assessee = await assessmentInstance.methods.assessee().call()
    let data = await assessmentInstance.methods.data(assessee).call()
    if (data) {
      data = getState().ethereum.web3.utils.hexToUtf8(data)
      dispatch(updateAssessmentVariable(address, 'data', data))
    }
  }
}

/*
  Updates the store by calling the respective function for each type of event.
*/
export function processEvent (user, sender, topic) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let isUser = user === userAddress
    switch (topic) {
      case NotificationTopic.AssessmentCreated:
        dispatch(fetchUserBalance())
        dispatch(fetchAssessmentData(sender))
        break
      case NotificationTopic.CalledAsAssessor:
        dispatch(fetchAssessmentData(sender))
        break
      case NotificationTopic.ConfirmedAsAssessor:
        if (isUser) {
          dispatch(fetchUserStage(sender))
          dispatch(fetchUserBalance())
        }
        dispatch(receiveAssessor(sender, user))
        break
      case NotificationTopic.AssessmentStarted:
        if (isUser) {
          dispatch(updateAssessmentVariable(sender, 'stage', Stage.Confirmed))
          dispatch(fetchUserStage(sender))
        }
        break
      case NotificationTopic.RevealScore:
        if (isUser) {
          dispatch(updateAssessmentVariable(sender, 'stage', Stage.Committed))
          dispatch(fetchUserStage(sender))
        }
        break
      case NotificationTopic.TokensPaidOut:
        if (isUser) {
          dispatch(updateAssessmentVariable(sender, 'stage', Stage.Done))
          dispatch(fetchUserStage(sender))
          dispatch(fetchPayout(sender, user))
          dispatch(fetchFinalScore(sender, user))
          dispatch(fetchUserBalance())
        }
        break
      case NotificationTopic.AssessmentFinished:
        if (isUser) {
          dispatch(updateAssessmentVariable(sender, 'stage', Stage.Done))
          dispatch(fetchUserStage(sender))
          dispatch(fetchPayout(sender, user))
          dispatch(fetchFinalScore(sender, user))
        }
        break
      default:
        console.log('no condition applied!', user, sender, topic)
    }
  }
}

export function receiveAssessor (address, assessor) {
  return {
    type: RECEIVE_ASSESSOR,
    address,
    assessor
  }
}

export function receiveAssessment (assessment) {
  return {
    type: RECEIVE_ASSESSMENT,
    assessment
  }
}

export function updateAssessmentVariable (address, name, value) {
  return {
    type: UPDATE_ASSESSMENT_VARIABLE,
    address,
    name,
    value
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

export function setAssessmentAsInvalid (address) {
  return {
    type: SET_ASSESSMENT_AS_INVALID,
    address
  }
}
