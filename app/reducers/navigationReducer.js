import {
  SET_DASHBOARD_TAB,
  SET_MAIN_DISPLAY,
  SET_INPUT_BAR,
  SET_NOTIFICATION_BAR,
  TOGGLE_HIDDEN_CARDS
} from '../actions/navigationActions.js'

const initialState = {
  dashboardTab: 'Current',
  mainDisplay: 'Main',
  notificationBar: {
    display: false
  },
  inputBar: '',
  showHiddenCards: false
}

export default function navigation (state = initialState, action) {
  switch (action.type) {
    case SET_DASHBOARD_TAB:
      return {
        ...state,
        dashboardTab: action.tab
      }
    case SET_MAIN_DISPLAY:
      return {
        ...state,
        mainDisplay: action.mainDisplay
      }
    case SET_NOTIFICATION_BAR:
      return {
        ...state,
        notificationBar: action.notificationBar
      }
    case SET_INPUT_BAR:
      return {
        ...state,
        inputBar: action.inputType
      }
    case TOGGLE_HIDDEN_CARDS:
      return {
        ...state,
        showHiddenCards: !state.showHiddenCards
      }
    default: return state
  }
}
