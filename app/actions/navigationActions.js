export const SET_DASHBOARD_TAB = 'SET_DASHBOARD_TAB'
export const SET_MAIN_DISPLAY = 'SET_MAIN_DISPLAY'
export const SET_NOTIFICATION_BAR = 'SET_NOTIFICATION_BAR'
export const SET_INPUT_BAR = 'SET_INPUT_BAR'
export const ADD_VISIT = 'ADD_VISIT'
export const RESET_VISITS = 'RESET_VISITS'
export const SAVE_PROGRESSION = 'SAVE_PROGRESSION'
export const SET_HELPER_SCREEN = 'SET_HELPER_SCREEN'

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

export function setMainDisplay (mainDisplay) {
  return {
    type: SET_MAIN_DISPLAY,
    mainDisplay
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

// export function dispatchNavigationAction (navigationAction) {
//   return async (dispatch) => {
//     dispatch(navigationAction)
//   }
// }

export function addVisit () {
  return {
    type: ADD_VISIT
  }
}

export function saveProgression (role, stage) {
  return {
    type: ADD_VISIT,
    role,
    stage
  }
}

export function resetVisits () {
  return {
    type: RESET_VISITS
  }
}

export function setHelperScreen (screen) {
  return {
    type: SET_HELPER_SCREEN,
    screen
  }
}
