import { getInstance, convertFromOnChainScoreToUIScore, hmmmToAha } from '../../utils.js'
import { sendAndReactToTransaction } from '../transaction/asyncActions'
import { receiveVariable } from '../web3/actions'
import { fetchUserBalance } from '../web3/asyncActions'
import { Stage, LoadingStage, NotificationTopic, TimeOutReasons } from '../../constants.js'
import { receiveAssessor, receiveAssessment, updateAssessmentVariable, beginLoadingAssessments, endLoadingAssessments, setAssessmentAsInvalid } from './actions'

// setup ipfs api
const ethereumjsABI = require('ethereumjs-abi')
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

export function hashScoreAndSalt (_score, _salt) {
  return '0x' + ethereumjsABI.soliditySHA3(
    ['int128', 'string'],
    [_score, _salt]
  ).toString('hex')
}

// async actions
export function confirmAssessor (assessmentAddress, customReact = false) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
    // TODO figure out how high this needs to be so fucking high for refund to work
    let params = {from: userAddress}
    if (customReact && customReact.gas) {
      params.gas = customReact.gas
    }
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.confirmAssessor().send(params) },
      customReact ? customReact.saveKeyword : Stage.Called,
      userAddress,
      assessmentAddress,
      customReact ? customReact.callbck : () => { dispatch(fetchUserStage(assessmentAddress)) }
    )
  }
}

export function commit (assessmentAddress, score, salt, customReact = false) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
    // TODO figure out how high this needs to be so fucking high for refund to work
    let params = {from: userAddress}
    if (customReact && customReact.gas) {
      params.gas = customReact.gas
    }
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.commit(hashScoreAndSalt(score, salt)).send(params) },
      customReact ? customReact.saveKeyword : Stage.Confirmed,
      userAddress,
      assessmentAddress,
      customReact ? customReact.callbck : () => { dispatch(fetchUserStage(assessmentAddress)) }
    )
  }
}

export function reveal (assessmentAddress, score, salt, customReact = false) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
    let params = {from: userAddress}
    if (customReact && customReact.gas) {
      params.gas = customReact.gas
    }
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.reveal(score, salt).send(params) },
      customReact ? customReact.saveKeyword : Stage.Committed,
      userAddress,
      assessmentAddress,
      customReact ? customReact.callbck : () => { dispatch(fetchUserStage(assessmentAddress)) }
    )
  }
}

export function storeDataOnAssessment (assessmentAddress, data) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
    // also salt should be saved in state
    let dataAsBytes = getState().ethereum.web3.utils.utf8ToHex(data)
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.addData(dataAsBytes).send({from: userAddress}) },
      'meetingPointChange',
      userAddress,
      assessmentAddress,
      () => { dispatch(fetchStoredData(assessmentAddress)) }
    )
  }
}

// refunds the user & cancels the assessment by calling the stage-specific action
// then updates the userStage & marks the assessment as refunded
export function refund (assessmentAddress, stage) {
  return async (dispatch, getState) => {
    const reactToRefund = (err) => {
      if (!err) {
        dispatch(updateAssessmentVariable(assessmentAddress, 'refunded', true))
        dispatch(fetchUserBalance(assessmentAddress))
      } else {
        console.log('error while refunding', err)
      }
    }
    const react = {
      gas: 320000,
      saveKeyword: 'refund',
      callbck: reactToRefund
    }
    switch (stage) {
      case Stage.Called:
        dispatch(confirmAssessor(assessmentAddress, react))
        break
      case Stage.Confirmed:
        dispatch(commit(assessmentAddress, 10, 'hihi', true))
        break
      case Stage.Committed:
        dispatch(reveal(assessmentAddress, 10, 'hihi', true))
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
      let lastUpdatedAt = getState().ethereum.lastUpdatedAt
      const fathomTokenInstance = getInstance.fathomToken(getState())
      let pastNotifications = await fathomTokenInstance.getPastEvents('Notification', {
        fromBlock: getState().ethereum.lastUpdatedAt,
        toBlock: 'latest'
      })

      // filter out all assessments where the user is involved
      let assessmentAddresses = pastNotifications.reduce((accumulator, notification) => {
        let assessment = notification.returnValues.sender
        // save all addressess where the user is involved
        if (notification.returnValues.user === userAddress && accumulator.indexOf(assessment) === -1) {
          accumulator.push(assessment)
        }
        // and save the greatest blockNumber
        if (notification.blockNumber > lastUpdatedAt) {
          lastUpdatedAt = notification.blockNumber
        }
        return accumulator
      }, [])

      // filter out destructed-assessments
      let destructedAssessments = pastNotifications.reduce((accumulator, notification) => {
        let assessment = notification.returnValues.sender
        // save all addressess where the user is involved but which were destructed
        if (assessmentAddresses.indexOf(assessment) !== -1 &&
          Number(notification.returnValues.topic) === NotificationTopic.AssessmentCancelled) {
          accumulator.push(assessment)
        }
        return accumulator
      }, [])

      // remove destructed assessments from list (NOTE: in a future refactor this could potentially be done with less code)
      for (let add of destructedAssessments) {
        let idx = assessmentAddresses.indexOf(add)
        if (idx > -1) { assessmentAddresses.splice(idx, 1) }
      }

      // and fetch the data for them by reconstruction from events
      destructedAssessments.forEach((assessmentAddress) => {
        dispatch(reconstructAssessment(assessmentAddress, pastNotifications.filter(x => x.returnValues.sender === assessmentAddress)))
      })

      // fetch data for assessments
      assessmentAddresses.forEach((assessmentAddress) => {
        dispatch(fetchAssessmentData(assessmentAddress))
      })
      dispatch(receiveVariable('lastUpdatedAt', lastUpdatedAt))
      dispatch(endLoadingAssessments())
    }
  }
}

/*
  reads the information needed to display an assessmentCard from events:
  - last assessment stage
  - userStage
  - assessee
  - concept (TODO)
  */
export function reconstructAssessment (assessmentAddress, pastNotifications) {
  return async (dispatch, getState) => {
    // let's not rely on events to be chronologically ordered
    const updateStage = (newStage, value) => { return newStage >= value ? newStage : value }
    let stage = Stage.None
    let userStage = Stage.None
    let violation = TimeOutReasons.NotEnoughAssessors
    let assessee = null
    let userAddress = getState().ethereum.userAddress
    // let concept = ?? // TODO figure out where to get this from
    for (let notification of pastNotifications) {
      switch (Number(notification.returnValues.topic)) {
        case NotificationTopic.AssessmentCreated:
          assessee = notification.returnValues.user
          break
        case NotificationTopic.CalledAsAssessor:
          if (notification.returnValues.user === userAddress) {
            userStage = updateStage(userStage, Stage.Called)
          }
          break
        case NotificationTopic.ConfirmedAsAssessor:
          if (notification.returnValues.user === userAddress) {
            userStage = updateStage(userStage, Stage.Confirmed)
          }
          break
        case NotificationTopic.AssessmentStarted:
          stage = updateStage(stage, Stage.Confirmed)
          violation = TimeOutReasons.NotEnoughCommits
          break
        case NotificationTopic.RevealScore:
          stage = updateStage(stage, Stage.Committed)
          violation = TimeOutReasons.NotEnoughReveals
          if (notification.returnValues.user === userAddress) {
            userStage = updateStage(userStage, Stage.Committed)
          }
          break
        default:
          if (Number(notification.returnValues.topic) !== NotificationTopic.CalledAsAssessor ||
              Number(notification.returnValues.topic) !== NotificationTopic.AssessmentCancelled) {
            console.log('whooopsi. this should not be reached! topic:', Number(notification.returnValues.topic)) // TODO no idea why this is reached sometimes, but it does not seem to hurt anything
          }
      }
    }
    let reconstructedAssessment = {
      assessmentAddress,
      stage,
      userStage,
      violation,
      conceptData: {name: 'Unknown', description: 'Unknown'}, // TODO get this from local storage
      refunded: true,
      assessee: assessee || null
    }
    dispatch(receiveAssessment(reconstructedAssessment))
  }
}

/*
  Called via the loading-hoc of AssessmentData.js, when the assessmentView is mounted and
  the assessment is not in the state already.
  Validates whether or not an assessment in the assessmentView is from a legal
  concept which also knows about the assessment, and if so
  calls fetchAssessmentData()
*/
export function validateAndFetchAssessmentData (assessmentAddress) {
  return async (dispatch, getState) => {
    try {
      console.log('in')
      let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
      // get conceptRegistry instance to verify assessment/concept/conceptRegistry link authenticity
      let conceptAddress = await assessmentInstance.methods.concept().call()
      let conceptRegistryInstance = getInstance.conceptRegistry(getState())
      let isValidConcept = await conceptRegistryInstance.methods.conceptExists(conceptAddress).call()
      // check if assessment is from concept
      let conceptInstance = getInstance.concept(getState(), conceptAddress)
      let isValidAssessment = await conceptInstance.methods.assessmentExists(assessmentAddress).call()
      // if concept is from Registry and assessment is from concept,
      // go ahead and fetch data, otherwise, add an invalid assessment object
      if (isValidConcept && isValidAssessment) {
        dispatch(fetchAssessmentData(assessmentAddress))
      } else {
        dispatch(setAssessmentAsInvalid(assessmentAddress))
      }
    } catch (e) {
      // maybe the assessment was cancelled?
      const fathomTokenInstance = getInstance.fathomToken(getState())
      let pastNotifications = await fathomTokenInstance.getPastEvents('Notification', {
        fromBlock: 0, // TODO put in deployedFathomTokenAt once it exists
        toBlock: 'latest',
        filter: {sender: assessmentAddress}
      })
      console.log('pastNotifications', pastNotifications)
      if (pastNotifications.length !== 0) {
        console.log('existsed')
        // dispatch(setAssessmentAsCancelled(assessmentAddress))
        dispatch(reconstructAssessment(assessmentAddress, pastNotifications))
      } else {
        console.log('Error trying to validate assessment: ', e)
        dispatch(setAssessmentAsInvalid(assessmentAddress))
      }
    }
  }
}

/*
  Fetch assessment data for one given assessment. If the basic assessment-Data
 is already in state (), it only fetches what could have changed via
 updateAssessment()
 */
export function fetchAssessmentData (assessmentAddress) {
  return async (dispatch, getState) => {
    try {
      // get static assessment info
      let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
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
      const deployedFathomTokenAt = getState().ethereum.deployedFathomTokenAt
      let pastEvents = await fathomTokenInstance.getPastEvents('Notification', {
        filter: {sender: assessmentAddress, topic: 2},
        fromBlock: deployedFathomTokenAt,
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
            filter: { _from: assessmentAddress, _to: userAddress },
            fromBlock: deployedFathomTokenAt,
            toBlock: 'latest'
          }
          let pastEvents = await fathomTokenInstance.getPastEvents('Transfer', filter)
          payout = hmmmToAha(pastEvents[0].returnValues['_value'])
        }
      }
      let hidden = false

      // see if assessment on track (not over timelimit)
      let realNow = Date.now() / 1000
      let violation = 0
      switch (stage) {
        case Stage.Called:
          if (realNow > Number(checkpoint)) { violation = TimeOutReasons.NotEnoughAssessors }
          break
        case Stage.Confirmed:
          if (realNow > Number(endTime)) { violation = TimeOutReasons.NotEnoughCommits }
          break
        case Stage.Committed:
          if (realNow > Number(endTime) + 24 * 60 * 60) { violation = TimeOutReasons.NotEnoughReveals }
          break
        default:
          console.log('no violation')
      }
      dispatch(receiveAssessment({
        assessmentAddress,
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
        payout,
        hidden
      }))
    } catch (e) {
      console.log('reading assessment-data from the chain did not work for assessment: ', assessmentAddress, e)
    }
  }
}

/*
  fetches the payouts of one or all assessors of a given assessment
  @param: if given only fetch payout of that one single user
*/
export function fetchPayout (assessmentAddress, user) {
  return async (dispatch, getState) => {
    const fathomTokenInstance = getInstance.fathomToken(getState())
    let filter = {
      filter: { _from: assessmentAddress, _to: user },
      fromBlock: getState().ethereum.deployedFathomTokenAt,
      toBlock: 'latest'
    }
    let pastEvents = await fathomTokenInstance.getPastEvents('Transfer', filter)
    let payout = pastEvents[0] ? pastEvents[0].returnValues['_value'] : undefined
    if (payout) dispatch(updateAssessmentVariable(assessmentAddress, 'payout', payout))
  }
}

export function fetchUserStage (assessmentAddress) {
  return async (dispatch, getState) => {
    let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
    let userAddress = getState().ethereum.userAddress
    let userStage = Number(await assessmentInstance.methods.assessorState(userAddress).call())
    let done = Number(await assessmentInstance.methods.done().call())
    if (getState().assessments[assessmentAddress].done !== done) {
      dispatch(updateAssessmentVariable(assessmentAddress, 'done', done))
    }
    dispatch(updateAssessmentVariable(assessmentAddress, 'userStage', userStage))
  }
}

export function fetchFinalScore (assessmentAddress) {
  return async (dispatch, getState) => {
    let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
    let onChainScore = Number(await assessmentInstance.methods.finalScore().call())
    // convert score to Front End range (FE:0,100%; BE:-100,100)
    let finalScore = convertFromOnChainScoreToUIScore(onChainScore)
    dispatch(updateAssessmentVariable(assessmentAddress, 'finalScore', finalScore))
  }
}

// part of fetchAssessmentData now

// returns the strings that are stored on the assessments
// for now, only the data stored by the assessee
export function fetchStoredData (selectedAssessment) {
  return async (dispatch, getState) => {
    let assessmentAddress = selectedAssessment || getState().assessments.selectedAssessment
    let assessmentInstance = getInstance.assessment(getState(), assessmentAddress)
    let assessee = await assessmentInstance.methods.assessee().call()
    let data = await assessmentInstance.methods.data(assessee).call()
    if (data) {
      data = getState().ethereum.web3.utils.hexToUtf8(data)
      dispatch(updateAssessmentVariable(assessmentAddress, 'data', data))
    }
  }
}

/*
  Updates the store by calling the respective function for each type of event.
*/
export function processEvent (user, sender, topic, blockNumber) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let isUser = user === userAddress
    dispatch(receiveVariable('lastUpdatedAt', blockNumber))
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
          dispatch(fetchUserBalance())
        }
        break
      default:
        console.log('no condition applied!', user, sender, topic)
    }
  }
}
