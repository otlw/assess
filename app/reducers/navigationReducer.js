import { SET_DASHBOARD_TAB, SET_MAIN_DISPLAY } from '../actions/navigationActions.js'

const initialState = {
  dashboardTab: 'Current',
  mainDisplay: 'Main'
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
    default: return state
  }
}
