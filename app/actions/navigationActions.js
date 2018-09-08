import { Stage } from '../constants.js'
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
  function to update the helperScreens by saving the approprioate keyword to the store
  either setHelperBar() for the notificationBar OR
  setHelperTakeOver() for the HelperTakeOver
  */
export function updateHelperScreen (keyWord, params) {
  return async (dispatch, getState) => {
    // cases when we want to show a full screen takeOver
    if (keyWord === 'NoMetaMask') {
      // here we could use the visit-history to be conditional, e.g.:
      if (getState().vists.site === 0) {
        dispatch(setHelperTakeOver('educateAboutMetaMask'))
      } else {
        dispatch(setHelperTakeOver('NoMetaMask'))
      }
    } else if (keyWord === 'UnlockMetaMask') {
      dispatch(setHelperTakeOver('UnlockMetaMask'))
    } else {
      // cases where we just want to show a HelperBar
      let helperBar = getHelperBar(getState().navigation.helperBarTopic, getState().navigation.visits, keyWord, params)
      if (helperBar && helperBar !== getState().navigation.helperBarTopic) {
        console.log('changing helperBar to: ', helperBar)
        dispatch(setHelperBar(helperBar))
      }
    }
  }
}

// define whether a situation should set a helper Bar or not, and if so, which one.
// TODO define more cases that return a key and their correspondant texts in constans.js
function getHelperBar (currentScreen, visits, keyWord, params) {
  // when visiting the assessmentView from another place / the first time on the page
  switch (keyWord) {
    case 'assessmentView': {
      if (visits.site < 100) {
        if (params.assessment.userStage === Stage.Called) return 'Staking'
        if (params.assessment.userStage === Stage.Confirmed) return 'Committing'
        if (params.assessment.userStage === Stage.Confirmed) return 'Revealing'
        // TODO add more stages here
      } else {
        return 'none'
      }
      break
    }
    case 'Staked':
      return 'Staked'
    case 'Committed':
    case 'Revealed':
      return 'none'
      // when setting a meeting point
    case 'StoredMeetingPoint': {
      // for the first time
      if (params.previousMeetingPointExisted) return 'none'
      // or updating it
      else return 'none'
    }
    default:
      return 'none'
  }
}

export function dispatchToggleHidden () {
  return async (dispatch) => {
    dispatch({type: TOGGLE_HIDDEN_CARDS})
  }
}
