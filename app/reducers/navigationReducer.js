import {
  SET_DASHBOARD_TAB,
  SET_HELPER_TAKEOVER,
  SET_INPUT_BAR,
  SET_NOTIFICATION_BAR,
  ADD_VISIT,
  SET_HELPER_SCREEN,
  RESET_VISITS,
  SAVE_PROGRESSION,
  TOGGLE_HIDDEN_CARDS
} from '../actions/navigationActions.js'
import { RECEIVE_PERSISTED_STATE } from '../actions/web3Actions.js'
import { Stage } from '../constants.js'

const initialState = {
  dashboardTab: 'Current',
  helperTakeOver: '',
  notificationBar: {
    display: false
  },
  inputBar: '',
  visits: {
    site: 0,
    assessor: Stage.None,
    assessee: Stage.None
  },
  helperBarTopic: '',
  showHiddenCards: false
}

export default function navigation (state = initialState, action) {
  switch (action.type) {
    case SET_DASHBOARD_TAB:
      return {
        ...state,
        dashboardTab: action.tab
      }
    case SET_HELPER_TAKEOVER:
      return {
        ...state,
        helperTakeOver: action.helperTakeOver
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
        helperBarTopic: action.key
      }
    case RECEIVE_PERSISTED_STATE:
      return {
        ...state,
        visits: action.persistedState.visits
      }
    case TOGGLE_HIDDEN_CARDS:
      return {
        ...state,
        showHiddenCards: !state.showHiddenCards
      }
    default: return state
  }
}
