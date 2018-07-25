import {
  SET_DASHBOARD_TAB,
  SET_MAIN_DISPLAY,
  SET_INPUT_BAR
} from '../actions/navigationActions.js'

const initialState = {
  dashboardTab: 'Current',
  mainDisplay: 'Main',
  inputBar: ''
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
    case SET_INPUT_BAR:
      return {
        ...state,
        inputBar: action.inputType
      }
    default: return state
  }
}
