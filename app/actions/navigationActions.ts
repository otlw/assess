export const SET_DASHBOARD_TAB = 'SET_DASHBOARD_TAB'
export const SET_MAIN_DISPLAY = 'SET_MAIN_DISPLAY'
export const SET_NOTIFICATION_BAR = 'SET_NOTIFICATION_BAR'
export const SET_INPUT_BAR = 'SET_INPUT_BAR'
export const TOGGLE_HIDDEN_CARDS = 'TOGGLE_HIDDEN_CARDS'

export function setDashboardTab (tab: string) {
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

export function dispatchSetInputBar (inputType: string) {
  return async (dispatch, getState) => {
    dispatch(setInputBar(inputType))
  }
}

export function setMainDisplay (mainDisplay: string) {
  return {
    type: SET_MAIN_DISPLAY,
    mainDisplay
  }
}

interface INotificationBar {
  display: boolean,
  type?: string
}

export function setNotificationBar (notificationBar: INotificationBar) {
  return {
    type: SET_NOTIFICATION_BAR,
    notificationBar
  }
}

export function setInputBar (inputType: string) {
  return {
    type: SET_INPUT_BAR,
    inputType
  }
}

export function dispatchToggleHidden () {
  return async (dispatch) => {
    dispatch({type: TOGGLE_HIDDEN_CARDS})
  }
}
