import { SET_DASHBOARD_TAB } from '../actions/navigationActions.js'

const initialState = {
  dashboardTab: 'Current'
}

export default function navigation (state = initialState, action) {
  switch (action.type) {
    case SET_DASHBOARD_TAB:
      return {
        ...state,
        dashboardTab: action.tab
      }
    default: return state
  }
}
