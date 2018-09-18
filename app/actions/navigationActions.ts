import {TState} from '../reducers/navigationReducer'

export type Action =
  ReturnType<typeof setDashboardTab> |
  ReturnType<typeof setMainDisplay> |
  ReturnType<typeof setNotificationBar> |
  ReturnType<typeof setInputBar> |
  ReturnType<typeof toggleHidden>

export function setDashboardTab (tab: TState['dashboardTab']) {
  let type: 'SET_DASHBOARD_TAB' = 'SET_DASHBOARD_TAB'
  return {
    type,
    tab
  }
}

export function setMainDisplay (mainDisplay: TState["mainDisplay"]) {
  let type:'SET_MAIN_DISPLAY' = 'SET_MAIN_DISPLAY'
  return {
    type,
    mainDisplay
  }
}

export function setNotificationBar (notificationBar: TState["notificationBar"]) {
  let type:'SET_NOTIFICATION_BAR' = 'SET_NOTIFICATION_BAR'
  return {
    type,
    notificationBar
  }
}

export function setInputBar (inputType: TState['inputBar']) {
  let type:'SET_INPUT_BAR' = 'SET_INPUT_BAR'
  return {
    type,
    inputType
  }
}

export function toggleHidden() {
  let type: 'TOGGLE_HIDDEN_CARDS' = 'TOGGLE_HIDDEN_CARDS'
  return {type}
}
