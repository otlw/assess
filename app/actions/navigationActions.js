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
    console.log('setting helperScrenn to ', keyWord)
    // TODO these keywords should be constants or imported from somewhere
    switch (keyWord) {
      // when the user
      case barTopic.Staking:
      case barTopic.Committing:
      case barTopic.Revealing:
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
      case 'AssessmentCreation':
        console.log('assessmentCreated')
        dispatch(setHelperTakeOver({topic: takeOverTopic.AssessmentCreation, params: params}))
        break
      default:
        console.log('helperKeyWord ', keyWord, ' is not processed yet.')
        break
    }
  }
}
