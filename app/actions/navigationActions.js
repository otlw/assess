import { Stage } from '../constants.js'
import { barTopic, takeOverTopic } from '../components/Helpers/helperContent.js'
export const SET_DASHBOARD_TAB = 'SET_DASHBOARD_TAB'
export const SET_HELPER_TAKEOVER = 'SET_HELPER_TAKEOVER'
export const SET_NOTIFICATION_BAR = 'SET_NOTIFICATION_BAR'
export const SET_INPUT_BAR = 'SET_INPUT_BAR'
export const ADD_VISIT = 'ADD_VISIT'
export const RESET_VISITS = 'RESET_VISITS'
export const SAVE_PROGRESSION = 'SAVE_PROGRESSION'
export const SET_HELPER_SCREEN = 'SET_HELPER_SCREEN'
export const TOGGLE_HIDDEN_CARDS = 'TOGGLE_HIDDEN_CARDS'

export function setDashboardTab (tab) {
  if (tab === 'Past' ||
    tab === 'Current' ||
    tab === 'Potential') {
    return {
      type: SET_DASHBOARD_TAB,
      tab
    }
  } else {
    throw Error('Invalid dashboard tab selected: ', tab)
  }
}

export function dispatchSetInputBar (inputType) {
  return async (dispatch, getState) => {
    dispatch(setInputBar(inputType))
  }
}

export function setHelperTakeOver (helperTakeOver) {
  console.log('setting takeover to', helperTakeOver)
  return {
    type: SET_HELPER_TAKEOVER,
    helperTakeOver
  }
}

export function setNotificationBar (notificationBar) {
  return {
    type: SET_NOTIFICATION_BAR,
    notificationBar
  }
}

export function setInputBar (inputType) {
  return {
    type: SET_INPUT_BAR,
    inputType
  }
}

export function addVisit () {
  return {
    type: ADD_VISIT
  }
}

export function saveProgression (role, stage) {
  return {
    type: SAVE_PROGRESSION,
    role,
    stage
  }
}

export function dispatchToggleHidden () {
  return async (dispatch) => {
    dispatch({type: TOGGLE_HIDDEN_CARDS})
  }
}

export function resetVisits () {
  return {
    type: RESET_VISITS
  }
}

export function setHelperBar (key) {
  return {
    type: SET_HELPER_SCREEN,
    key
  }
}

/*
  main function to update the helperScreens by saving the approprioate keyword to the store
  either setHelperBar() for the notificationBar OR
  setHelperTakeOver() for the HelperTakeOver
  What screen to display can be determined conditional on the keyWord, addtionaal params passed along with it,
  the visit-history of the user and the currently active screens
  */
export function updateHelperScreen (keyWord, params) {
  return async (dispatch, getState) => {
    let visits = getState().navigation.visits
    console.log('setting helperScrenn to ', keyWord)
    switch (keyWord) {
      case 'NoMetaMask': {
        // here we could use the visit-history to be conditional, e.g.:
        if (getState().vists.site === 0) {
          dispatch(setHelperTakeOver(takeOverTopic.educateAboutMetaMask))
        } else {
          dispatch(setHelperTakeOver(takeOverTopic.NoMetaMask))
        }
        break
      }
      case 'UnlockMetaMask':
        dispatch(setHelperTakeOver(takeOverTopic.UnlockMetaMask))
        break
      case 'assessmentView': {
        // the user visits the assessmentView-page
        let userActionRequired = params.assessment.userStage === params.assessment.stage
        if (visits.site < 400) {
          if (userActionRequired) {
            // needs to do something AND
            // is not super-duper-experienced
            if (params.assessment.userStage === Stage.Called) dispatch(setHelperBar(barTopic.Staking))
            if (params.assessment.userStage === Stage.Confirmed) dispatch(setHelperBar(barTopic.Committing))
            if (params.assessment.userStage === Stage.Confirmed) dispatch(setHelperBar(barTopic.Revealing))
          } else if (params.assessment.assessee === getState().ethereum.userAddress) {
            // display something to inform the user
            console.log('some helperScreen could be shown to inform the user (=assessee)')
          }
        }
        break
      }
      case 'AssessmentProcess':
        dispatch(setHelperTakeOver(takeOverTopic.AssessmentProcess))
        break
      case 'ConfirmedStake':
        // not sure we acutally want to have a differentBar there, this should just be an example of how
        // we can react to the user having completed a specific action
        dispatch(setHelperBar(barTopic.ConfirmedStake))
        break
      // NOTE: stacked cases mean that the same action will happen for all of them.
      case 'ConfirmedCommit':
      case 'ConfirmedReveal':
      case 'StoredMeetingPoint': {
        // for the first time
        if (params.previousMeetingPointExisted) {
          // dispatch(setHelperBar(barTopic.FirstTimeMeetingPointSet))
        } else {
          // dispatch(setHelperBar(barTopic.MeetingPointChanged))
        }
        break
      }
      case 'MoreAboutStaking':
      case 'MoreAboutCommitting':
      case 'MoreAboutRevealing':
        dispatch(setHelperTakeOver({topic: takeOverTopic.AssessmentProcess}))
        break
      case 'closeTakeOver':
        dispatch(setHelperTakeOver(''))
        break
      case 'closeBar':
        dispatch(setHelperBar(''))
        break
      case 'assessmentCreation':
        console.log('assessmentCreated')
        dispatch(setHelperTakeOver({topic: takeOverTopic.AssessmentCreation, params: params}))
        break
      default:
        console.log('helperKeyWord ', keyWord, ' is not processed yet.')
        break
    }
  }
}
