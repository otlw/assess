import { getInstance, convertFromOnChainScoreToUIScore, hmmmToAha } from '../../utils'
import { sendAndReactToTransaction } from '../transaction/asyncActions'
import { getDecodedConceptData } from '../concept/asyncActions'
import { setHelperBar } from '../navigation/actions'
import { fetchUserBalance } from '../web3/asyncActions'
import { Stage, UserStageAction, NotificationTopic, TimeOutReasons } from '../../constants'
import {
  receiveAssessment,
  updateAssessmentVariable,
  setAssessmentAsInvalid
} from './actions'
import { Dispatch } from 'redux'
import { 
  //TransactionReceipt, 
  EventLog 
} from 'web3/types'

const ethereumjsABI = require('ethereumjs-abi')

export function hashScoreAndSalt (_score:number, _salt:string) {
  return '0x' + ethereumjsABI.soliditySHA3(
    ['int128', 'string'],
    [_score, _salt]
  ).toString('hex')
}

// type callbacksType = {
//   transactionHash?: (hash: string) => void | null
//   confirmation?: (status: boolean, receipt: TransactionReceipt | Error) => void
//   error?: (error: Error) => void
//   gas?:number
//   purpose?:string
// }

type callParams={
  from:string
  gas?:number
}

// async actions
export function confirmAssessor (assessmentAddress:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let userAddress:string = getState().ethereum.userAddress
    let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
    // TODO figure out how high this needs to be so fucking high for refund to work
    let params:callParams = {from: userAddress}
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.confirmAssessor().send(params) }, // transaction
      UserStageAction[Stage.Called], // tx purpose
      userAddress,
      assessmentAddress,
      {
          confirmation: () => {
            dispatch(fetchUserBalance())
            dispatch(fetchUserStage(assessmentAddress))
            dispatch(setHelperBar('ConfirmedStake'))
          }
      }
    )
  }
}

export function commit (assessmentAddress:string, score:number, salt:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let userAddress:string = getState().ethereum.userAddress
    let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
    // TODO figure out how high this needs to be so fucking high for refund to work
    let params:callParams = {from: userAddress}
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.commit(hashScoreAndSalt(score, salt)).send(params) }, // transaction
      UserStageAction[Stage.Confirmed], // tx purpose
      userAddress,
      assessmentAddress,
      {
          confirmation: () => {
            dispatch(fetchUserStage(assessmentAddress))
            dispatch(setHelperBar('ConfirmedCommit'))
          }
      }
    )
  }
}

export function reveal (assessmentAddress:string, score:number, salt:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let userAddress:string = getState().ethereum.userAddress
    let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
    let params:callParams = {from: userAddress}
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.reveal(score, salt).send(params) }, // transaction
      UserStageAction[Stage.Committed], // tx purpose
      userAddress,
      assessmentAddress,
      {
          confirmation: () => {
            dispatch(fetchUserStage(assessmentAddress))
            dispatch(setHelperBar('ConfirmedReveal'))
          }
      }
    )
  }
}

export function storeDataOnAssessment (assessmentAddress:string, newData:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let userAddress:string = getState().ethereum.userAddress
    let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
    // also salt should be saved in state
    let dataAsBytes:string = getState().ethereum.web3.utils.utf8ToHex(newData)
    let firstEdit:boolean = getState().assessments[assessmentAddress].data === ''
    sendAndReactToTransaction(
      dispatch,
      () => { return assessmentInstance.methods.addData(dataAsBytes).send({from: userAddress}) },
      firstEdit ? 'setMeetingPoint' : 'meetingPointChange',
      userAddress,
      assessmentAddress,
      {
        confirmation: () => {
          dispatch(fetchStoredData(assessmentAddress))
          if (firstEdit) dispatch(setHelperBar('FirstTimeMeetingPointSet'))
          else { dispatch(setHelperBar('MeetingPointChanged')) }
        }
      }
    )
  }
}

// refunds the user & cancels the assessment by calling the stage-specific action
// then updates the userStage & marks the assessment as refunded
export function refund (assessmentAddress:string, stage:number) {
  return async (dispatch: Dispatch<any, any>, _getState: any) => {

    // NB why do we have a custom react for the refund?

    // const reactToRefund:(any)=>void = (err:Error) => {
    //   if (!err) {
    //     dispatch(updateAssessmentVariable(assessmentAddress, 'refunded', true))
    //     dispatch(fetchUserBalance())
    //   } else {
    //     console.log('error while refunding', err)
    //   }
    // }
    // const react:any = {
    //   gas: 320000,
    //   purpose: 'refund',
    //   callbck: {
    //     confirmation: reactToRefund
    //   }
    // }

    // TODO: stage should be a type
    switch (stage) {
      case Stage.Called:
        dispatch(confirmAssessor(assessmentAddress))
        break
      case Stage.Confirmed:
        dispatch(commit(assessmentAddress, 10, 'hihi'))
        break
      case Stage.Committed:
        dispatch(reveal(assessmentAddress, 10, 'hihi'))
        break
      default:
        console.log('something went wrong with the refunding!!!')
    }
  }
}

export function fetchCredentials (address:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    const fathomTokenInstance:any = getInstance.fathomToken(getState())
    const deployedFathomTokenAt:number = getState().ethereum.deployedFathomTokenAt
    let pastNotifications:EventLog[] = await fathomTokenInstance.getPastEvents('Notification', {
      filter: {to: address, topic: 7},
      fromBlock: deployedFathomTokenAt,
      toBlock: 'latest'
    })

    pastNotifications.map((notification) => {
      dispatch(fetchAssessmentData(notification.returnValues.sender))
    })
  }
}

/*
  Called ONLY ONCE via the loading-hoc of FilterView-component.
  Fetches all data for all assessments (static, dynamic info & assessor-related info)
  using different methods for existing and cancelled (self-destructed) assessments
*/
export function fetchLatestAssessments (currentBlock:number) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let userAddress:string = getState().ethereum.userAddress

    // get notification events from fathomToken contract
    const fathomTokenInstance:any = getInstance.fathomToken(getState())
    let pastNotifications:EventLog[] = await fathomTokenInstance.getPastEvents('Notification', {
      fromBlock: getState().ethereum.lastUpdatedAt,
      toBlock: currentBlock
    })

    // filter out all assessments where the user is involved
    let assessmentAddresses:string[] = pastNotifications.reduce((accumulator, notification) => {
      let assessment = notification.returnValues.sender
      // save all addressess where the user is involved
      if (notification.returnValues.user === userAddress && accumulator.indexOf(assessment) === -1) {
        accumulator.push(assessment)
      }
      return accumulator
    }, [])

    // filter out destructed-assessments
    let destructedAssessments:string[] = pastNotifications.reduce((accumulator, notification) => {
      let assessment = notification.returnValues.sender
      // save all addressess where the user is involved but which were destructed
      if (assessmentAddresses.indexOf(assessment) !== -1 &&
          Number(notification.returnValues.topic) === NotificationTopic.AssessmentCancelled) {
        accumulator.push(assessment)
      }
      return accumulator
    }, [])

    // remove destructed assessments from list (TODO NOTE: in a future refactor this could potentially be done with less code)
    for (let add:string of destructedAssessments) {
      let idx = assessmentAddresses.indexOf(add)
      if (idx > -1) { assessmentAddresses.splice(idx, 1) }
    }

    // and fetch the data for them by reconstruction from events
    await Promise.all(destructedAssessments.map((assessmentAddress:string) => {
      dispatch(reconstructAssessment(assessmentAddress, pastNotifications.filter(x => x.returnValues.sender === assessmentAddress)))
    }))

    // fetch data for ongoing assessments
    await Promise.all(assessmentAddresses.map(async (assessmentAddress:string) => {
      await fetchAssessmentData(assessmentAddress)(dispatch, getState)
    }))
    return currentBlock
  }
}

/*
  reads the information needed to display an assessmentCard from events:
  - last assessment stage
  - userStage
  - assessee
  - concept (TODO)
  */
export function reconstructAssessment (assessmentAddress:string, pastNotifications:EventLog[]) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    // let's not rely on events to be chronologically ordered
    const updateStage:number = (newStage, value) => { return newStage >= value ? newStage : value }
    let stage:number = Stage.None
    let userStage:number = Stage.None
    let violation:number = TimeOutReasons.NotEnoughAssessors
    let assessee:string = 'Unknown'
    let userAddress:string = getState().ethereum.userAddress
    // let concept = ?? // TODO figure out where to get this from
    for (let notification:EventLog of pastNotifications) {
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
    let reconstructedAssessment:any = {
      address: assessmentAddress,
      stage,
      userStage,
      violation,
      conceptData: {name: 'Unknown', description: 'Unknown'}, // TODO get this from local storage
      refunded: true,
      assessee: assessee
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
export function validateAndFetchAssessmentData (assessmentAddress:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    try {
      let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
      // get conceptRegistry instance to verify assessment/concept/conceptRegistry link authenticity
      let conceptAddress:string = await assessmentInstance.methods.concept().call()
      let conceptRegistryInstance:any = getInstance.conceptRegistry(getState())
      let isValidConcept:boolean = await conceptRegistryInstance.methods.conceptExists(conceptAddress).call()
      // check if assessment is from concept
      let conceptInstance:any = getInstance.concept(getState(), conceptAddress)
      let isValidAssessment:boolean = await conceptInstance.methods.assessmentExists(assessmentAddress).call()
      // if concept is from Registry and assessment is from concept,
      // go ahead and fetch data, otherwise, add an invalid assessment object
      if (isValidConcept && isValidAssessment) {
        dispatch(fetchAssessmentData(assessmentAddress))
      } else {
        dispatch(setAssessmentAsInvalid(assessmentAddress))
      }
    } catch (e:Error) {
      // maybe the assessment was cancelled?
      const fathomTokenInstance:any = getInstance.fathomToken(getState())
      let pastNotifications:EventLog[] = await fathomTokenInstance.getPastEvents('Notification', {
        fromBlock: getState().ethereum.deployedFathomTokenAt,
        toBlock: 'latest',
        filter: {sender: assessmentAddress}
      })

      if (pastNotifications.length !== 0) {
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
export function fetchAssessmentData (assessmentAddress:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    try {
      // get static assessment info
      let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
      let cost:number = hmmmToAha(await assessmentInstance.methods.cost().call())
      let endTime:number = await assessmentInstance.methods.endTime().call()

      // checkpoint -> keeps track of timelimits for 1) latest possible time to confirm and 2) earliest time to reveal
      let checkpoint:number = await assessmentInstance.methods.checkpoint().call()
      let size:number = await assessmentInstance.methods.size().call()
      let assessee:string = await assessmentInstance.methods.assessee().call()
      let conceptAddress:string = await assessmentInstance.methods.concept().call()
      let stage:number = Number(await assessmentInstance.methods.assessmentStage().call())

      // get concept data
      let decodedConceptData:any = await getDecodedConceptData(conceptAddress)

      // Dynamic Info
      let done:number = Number(await assessmentInstance.methods.done().call())
      let userAddress:string = getState().ethereum.userAddress
      let userStage:number = (userAddress !== assessee) ? Number(await assessmentInstance.methods.assessorState(userAddress).call()) : 0

      let dataBytes:string = await assessmentInstance.methods.data(assessee).call()
      let data:string = dataBytes ? getState().ethereum.web3.utils.hexToUtf8(dataBytes) : ''

      const fathomTokenInstance:any = getInstance.fathomToken(getState())
      const deployedFathomTokenAt:number = getState().ethereum.deployedFathomTokenAt
      let pastEvents:EventLog[] = await fathomTokenInstance.getPastEvents('Notification', {
        filter: {sender: assessmentAddress, topic: 2},
        fromBlock: deployedFathomTokenAt,
        toBlock: 'latest'
      })
      let assessors:string[] = pastEvents.map(x => x.returnValues.user)

      let finalScore:number, payout:number
      if (stage === Stage.Done) {
        let onChainScore:number = Number(await assessmentInstance.methods.finalScore().call())
        // convert score to Front End range (FE:0,100%; BE:-100,100)
        finalScore = convertFromOnChainScoreToUIScore(onChainScore)
        // only fetch Payout if user is not assesse and payout is not already there
        if (assessors.includes(userAddress)) {
          let filter:any = {
            filter: { _from: assessmentAddress, _to: userAddress },
            fromBlock: deployedFathomTokenAt,
            toBlock: 'latest'
          }
          let pastEvents:EventLog[] = await fathomTokenInstance.getPastEvents('Transfer', filter)
          payout = hmmmToAha(pastEvents[0].returnValues['_value'])
        }
      }

      // see if assessment on track (not over timelimit)
      let realNow:number = Date.now() / 1000
      let violation:number = 0
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
        address: assessmentAddress,
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
        hidden: false
      }))
    } catch (e:Error) {
      console.log('reading assessment-data from the chain did not work for assessment: ', assessmentAddress, e)
    }
  }
}

/*
  fetches the payouts of one or all assessors of a given assessment
  @param: if given only fetch payout of that one single user
*/
export function fetchPayout (assessmentAddress:string, user:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    const fathomTokenInstance = getInstance.fathomToken(getState())
    let filter:any = {
      filter: { _from: assessmentAddress, _to: user },
      fromBlock: getState().ethereum.deployedFathomTokenAt,
      toBlock: 'latest'
    }
    let pastEvents:EventLog[] = await fathomTokenInstance.getPastEvents('Transfer', filter)
    let payout:number = pastEvents[0] ? pastEvents[0].returnValues['_value'] : undefined
    if (payout) dispatch(updateAssessmentVariable(assessmentAddress, 'payout', payout))
  }
}

export function fetchUserStage (assessmentAddress:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
    let userAddress:string = getState().ethereum.userAddress
    let userStage:number = Number(await assessmentInstance.methods.assessorState(userAddress).call())
    let done:number = Number(await assessmentInstance.methods.done().call())
    if (getState().assessments[assessmentAddress].done !== done) {
      dispatch(updateAssessmentVariable(assessmentAddress, 'done', done))
    }
    dispatch(updateAssessmentVariable(assessmentAddress, 'userStage', userStage))
  }
}

export function fetchFinalScore (assessmentAddress:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
    let onChainScore:number = Number(await assessmentInstance.methods.finalScore().call())
    // convert score to Front End range (FE:0,100%; BE:-100,100)
    let finalScore:number = convertFromOnChainScoreToUIScore(onChainScore)
    dispatch(updateAssessmentVariable(assessmentAddress, 'finalScore', finalScore))
  }
}

// part of fetchAssessmentData now

// returns the strings that are stored on the assessments
// for now, only the data stored by the assessee
export function fetchStoredData (selectedAssessment:string) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let assessmentAddress:string = selectedAssessment || getState().assessments.selectedAssessment
    let assessmentInstance:any = getInstance.assessment(getState(), assessmentAddress)
    let assessee:string = await assessmentInstance.methods.assessee().call()
    let data:string = await assessmentInstance.methods.data(assessee).call()
    if (data) {
      console.log('data')
      data = getState().ethereum.web3.utils.hexToUtf8(data)
      dispatch(updateAssessmentVariable(assessmentAddress, 'data', data))
    }
  }
}
