import { NavigationState } from './reducer'

export type Action =
  ReturnType<typeof setDashboardTab> |
  ReturnType<typeof setMainDisplay> |
  ReturnType<typeof setNotificationBar> |
  ReturnType<typeof setInputBar> |
  ReturnType<typeof toggleHidden>

export function setDashboardTab (dashboardTab: NavigationState['dashboardTab']) {
  let type: 'SET_DASHBOARD_TAB' = 'SET_DASHBOARD_TAB'
  return {
    type,
    dashboardTab
  }
}

export function setMainDisplay (mainDisplay: NavigationState["mainDisplay"]) {
  let type:'SET_MAIN_DISPLAY' = 'SET_MAIN_DISPLAY'
  return {
    type,
    mainDisplay
  }
}

export function setNotificationBar (notificationBar: NavigationState["notificationBar"]) {
  let type:'SET_NOTIFICATION_BAR' = 'SET_NOTIFICATION_BAR'
  return {
    type,
    notificationBar
  }
}

export function setInputBar (inputBar: NavigationState['inputBar']) {
  let type:'SET_INPUT_BAR' = 'SET_INPUT_BAR'
  return {
    type,
    inputBar
  }
}

export function toggleHidden() {
  let type: 'TOGGLE_HIDDEN_CARDS' = 'TOGGLE_HIDDEN_CARDS'
  return {type}
}
