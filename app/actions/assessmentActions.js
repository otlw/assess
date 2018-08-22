import { convertDate, getInstance, convertFromOnChainScoreToUIScore, hmmmToAha } from '../utils.js'
import { sendAndReactToTransaction } from './transActions.js'
import { fetchUserBalance } from './web3Actions.js'
import { StageDisplayNames, Stage, LoadingStage, NotificationTopic, TimeOutReasons } from '../constants.js'

export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
export const REMOVE_ASSESSMENT = 'REMOVE_ASSESSMENT'
export const RECEIVE_ASSESSOR = 'RECEIVE_ASSESSOR'
export const BEGIN_LOADING_ASSESSMENTS = 'BEGIN_LOADING_ASSESSMENTS'
export const END_LOADING_ASSESSMENTS = 'END_LOADING_ASSESSMENTS'
export const SET_ASSESSMENT_AS_INVALID = 'SET_ASSESSMENT_AS_INVALID'
export const UPDATE_ASSESSMENT_VARIABLE = 'UPDATE_ASSESSMENT_VARIABLE'

const ethereumjsABI = require('ethereumjs-abi')

// setup ipfs api
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

export function hashScoreAndSalt (_score, _salt) {
  return '0x' + ethereumjsABI.soliditySHA3(
    ['int128', 'string'],
    [_score, _salt]
  ).toString('hex')
}

// ============== async actions ===================

export function confirmAssessor (address, triggeringRefund = false) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    // TODO figure out how high this needs to be so fucking high for refund to work
    let params = {from: userAddress}
    if (triggeringRefund) {
      params.gas = 320000
    }
    console.log('params', params)
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.confirmAssessor().send(params) },
      triggeringRefund ? 'Refund' : Stage.Called,
      userAddress,
      address,
      triggeringRefund
        ? (err) => { if (!err) { dispatch(updateAssessmentVariable(address, 'refunded', true)) } }
        : () => { dispatch(fetchUserStage(address)) }
    )
  }
}

export function commit (address, score, salt, triggeringRefund = false) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    // TODO figure out how high this needs to be so fucking high for refund to work
    let params = {from: userAddress}
    if (triggeringRefund) {
      params.gas = 320000
    }
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.commit(hashScoreAndSalt(score, salt)).send(params) },
      triggeringRefund ? 'Refund' : Stage.Confirmed,
      userAddress,
      address,
      triggeringRefund
        ? (err) => { if (!err) { dispatch(updateAssessmentVariable(address, 'refunded', true)) } }
        : () => { dispatch(fetchUserStage(address)) }
    )
  }
}

export function reveal (address, score, salt, triggeringRefund = false) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), address)
    let params = {from: userAddress}
    if (triggeringRefund) {
      // TODO figure out how high this needs to be so fucking high for refund to work
      params.gas = 320000
    }
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.reveal(score, salt).send(params) },
      triggeringRefund ? 'Refund' : Stage.Committed,
      userAddress,
      address,
      triggeringRefund
        ? (err) => { if (!err) { dispatch(updateAssessmentVariable(address, 'refunded', true)) } }
        : () => { dispatch(fetchUserStage(address)) }
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

// refunds the user & cancels the assessment by calling the stage-specific action
// then updates the userStage & marks the assessment as refunded
export function refund (address, stage) {
  return async (dispatch, getState) => {
    switch (stage) {
      case Stage.Called:
      dispatch(confirmAssessor(address, true, ))
        break
      case Stage.Confirmed:
        dispatch(commit(address, 10, 'hihi', true))
        break
      case Stage.Committed:
        dispatch(reveal(address, 10, 'hihi', true))
        break
      default:
        console.log('something went wrong with the refunding!!!')
    }
  }
}

/*
  Called ONLY ONCE via the loading-hoc of FilterView-component.
  Fetches all data for all assessments (static, dynamic info & assessor-related info)
  using different methods for existing and cancelled (self-destructed) assessments
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

      // filter out all assessments where the user is involved
      let assessmentAddresses = pastNotifications.reduce((accumulator, notification) => {
        let assessment = notification.returnValues.sender
        // save all addressess where the user is involved
        if (notification.returnValues.user === userAddress && accumulator.indexOf(assessment) === -1) {
          accumulator.push(assessment)
        }
        return accumulator
      }, [])

      // filter out destructed-assessments
      let destructedAssessments = pastNotifications.reduce((accumulator, notification) => {
        let assessment = notification.returnValues.sender
        // console.log('notification',notification.returnValues)
        // save all addressess where the user is involved but which were destructed
        if (assessmentAddresses.indexOf(assessment) !== -1 &&
          Number(notification.returnValues.topic) === NotificationTopic.AssessmentCancelled) {
          accumulator.push(assessment)
        }
        return accumulator
      }, [])
      // console.log('destructedAssessments ',destructedAssessments )

      console.log('before', assessmentAddresses.length)
      // remove destruced assessments from list
      for (let add of destructedAssessments) {
        let idx = assessmentAddresses.indexOf(add)
        if (idx > -1) { assessmentAddresses.splice(idx, 1) }
      }
      console.log('after', assessmentAddresses.length)

      // and fetch the data for them by reconstruction from events
      destructedAssessments.forEach((address) => {
        dispatch(reconstructAssessment(address, pastNotifications.filter(x => x.returnValues.sender === address)))
      })

      // fetch data for assessments
      assessmentAddresses.forEach((address) => {
        dispatch(fetchAssessmentData(address))
      })
      dispatch(endLoadingAssessments())
    }
  }
}

/*
  reads the information needed to display an assessmentCard from events:
  - last assessment stage
  - userStage
  - assessee
  - concept (NOT YET)
  NOTE: this assumes events are in chronological order -> TODO only save if value is > than what is saved so far
  */
export function reconstructAssessment (address, pastNotifications) {
  return async (dispatch, getState) => {
    let stage = Stage.Called
    let userStage = Stage.Called
    let violation = TimeOutReasons.NotEnoughAssessors
    let assessee = null
    let userAddress = getState().ethereum.userAddress
    // let concept = pastNotifications[0].returnvalues.sender // TODO figure out where to get this from
    for (let not of pastNotifications) {
      switch (Number(not.returnValues.topic)) {
        case NotificationTopic.AssessmentCreated:
          userStage = Stage.None
          assessee = not.returnValues.user
          break
        case NotificationTopic.ConfirmedAsAssessor:
          if (not.returnValues.user === userAddress) {
            userStage = Stage.Confirmed
          }
          break
        case NotificationTopic.AssessmentStarted:
          stage = Stage.Confirmed
          violation = TimeOutReasons.NotEnoughCommits
          break
        case NotificationTopic.RevealScore:
          stage = Stage.Committed
          violation = TimeOutReasons.NotEnoughReveals
          if (not.returnValues.user === userAddress) {
            userStage = Stage.Committed
          }
          break
        default:
          if (Number(not.returnValues.topic) !== NotificationTopic.CalledAsAssessor ||
              Number(not.returnValues.topic) !== NotificationTopic.AssessmentCancelled) {
            console.log('whooopsi. this should not be reached! topic:', Number(not.returnValues.topic)) //TODO no idea why this is reached sometimes, but it does not seem to hurt anything
          }
      }
    }
    if (userStage > Stage.Called || assessee === userAddress) {
      // console.log('interesting destructed assment:', stage, userStage, violation)
      let reconstructedAssessment = {
        address,
        stage,
        userStage,
        violation,
        concept: 'Unknown',
        refunded: true,
        assessee: assessee || null
      }
      console.log('reconstructedAssessment', reconstructedAssessment)
      dispatch(receiveAssessment(reconstructedAssessment))
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
      console.log('Error trying to validate assessment: ', e)
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
      let cost = hmmmToAha(await assessmentInstance.methods.cost().call())
      let endTime = await assessmentInstance.methods.endTime().call()

      // checkpoint -> keeps track of timelimits for 1) latest possible time to confirm and 2) earliest time to reveal
      let checkpoint = await assessmentInstance.methods.checkpoint().call()
      let size = await assessmentInstance.methods.size().call()
      let assessee = await assessmentInstance.methods.assessee().call()
      let conceptAddress = await assessmentInstance.methods.concept().call()
      let conceptInstance = getInstance.concept(getState(), conceptAddress)
      let stage = Number(await assessmentInstance.methods.assessmentStage().call())

      // handle concept data
      let conceptDataHex = await conceptInstance.methods.data().call()
      let decodedConceptDataHash = Buffer.from(conceptDataHex.slice(2), 'hex').toString('utf8')
      let decodedConceptData

      // retrieve JSON from IPFS if the concept data is an IPFS hash
      if (decodedConceptDataHash.substring(0, 2) === 'Qm') {
        // verify that description is correctly stord and log it
        let resp = await ipfs.get(decodedConceptDataHash)
        decodedConceptData = resp[0].content.toString()

        // parse JSON
        decodedConceptData = JSON.parse(decodedConceptData)
      } else {
        // if no ipfs hash, just use data string decodedConceptDataHash
        decodedConceptData = {
          name: decodedConceptDataHash,
          description: decodedConceptDataHash
        }
      }

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
          payout = hmmmToAha(pastEvents[0].returnValues['_value'])
        }
      }

      // see if assessment on track (not over timelimit)
      let realNow = Date.now() / 1000
      console.log('realNow', convertDate(realNow))
      let testNow = (await getState().ethereum.web3.eth.getBlock('latest')).timestamp
      // console.log('testnnow', testNow, convertDate(testNow))
      // console.log('endTime', convertDate(Number(endTime)), testNow > Number(endTime))
      console.log('checking point:', convertDate(Number(checkpoint)), realNow > Number(checkpoint))
      // console.log('stage', StageDisplayNames[stage])

      let violation = 0
      switch (stage) {
        case Stage.Called:
          if (realNow > Number(checkpoint)) { violation = TimeOutReasons.NotEnoughAssessors }
          break
        case Stage.Confirmed:
          if (realNow > Number(endTime)) { violation = TimeOutReasons.NotEnoughCommits }
          break
        case Stage.Committed:
          // console.log('condition is:', testNow , Number(endTime) + 24*60*60)
          if (realNow > Number(endTime) + 24 * 60 * 60) { violation = TimeOutReasons.NotEnoughReveals }
          break
        default:
          console.log('no violation. done:', stage === Stage.Done)
          violation = false
      }
      console.log('assessment' + address + ' has timed out. reason: ', violation)

      dispatch(receiveAssessment({
        address,
        cost,
        checkpoint,
        stage,
        violation,
        refunded: false,
        userStage,
        endTime,
        done,
        size,
        assessee,
        conceptAddress,
        conceptData: decodedConceptData,
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
      case NotificationTopic.AssessmentFinished:
        if (isUser) {
          dispatch(updateAssessmentVariable(sender, 'stage', Stage.Done))
          dispatch(fetchUserStage(sender))
          dispatch(fetchPayout(sender, user))
          dispatch(fetchFinalScore(sender, user))
          dispatch(fetchUserBalance())
        }
        break
      case NotificationTopic.AssessmentCancelled:
        if (isUser) {
          dispatch(updateAssessmentVariable(sender, 'refunded', true))
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
