import {
  SET_DASHBOARD_TAB,
  SET_MAIN_DISPLAY,
  SET_INPUT_BAR,
  SET_NOTIFICATION_BAR,
  ADD_VISIT,
  SET_HELPER_SCREEN,
  RESET_VISITS,
  SAVE_PROGRESSION
} from '../actions/navigationActions.js'

import { Stage } from '../constants.js'

const initialState = {
  dashboardTab: 'Current',
  mainDisplay: 'Main',
  notificationBar: {
    display: false
  },
  inputBar: '',
  visits: {
    site: 0,
    assessor: Stage.None,
    assessee: Stage.None
  },
  helperScreen: 'Welcome'
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
    case ADD_VISIT:
      return {
        ...state,
        visits: {
          ...state.visits,
          site: state.visits.site + 1
        }
      }
    case RESET_VISITS:
      return {
        ...state,
        visits: {
          site: 0,
          assessor: Stage.None,
          assessee: Stage.None
        }
      }
    case SAVE_PROGRESSION:
      return {
        ...state,
        visits: {
          ...state.visits,
          [action.role]: action.stage > state.visits[action.role] ? action.stage : state.visits[action.role]
        }
      }
    case SET_HELPER_SCREEN:
      return {
        ...state,
        helperScreen: action.screen
      }
    default: return state
  }
}
