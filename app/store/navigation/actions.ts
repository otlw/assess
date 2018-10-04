import { NavigationState } from './reducer'

export type Action =
  ReturnType<typeof setDashboardTab> |
  ReturnType<typeof setModal> |
  ReturnType<typeof setHelperBar> |
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

export function setModal (modal: NavigationState["modal"]) {
  let type:'SET_MODAL' = 'SET_MODAL'
  return {
    type,
    modal
  }
}

export function setHelperBar (helperBar: NavigationState["helperBar"]) {
  let type:'SET_HELPERBAR' = 'SET_HELPERBAR'
  return {
    type,
    helperBar
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
