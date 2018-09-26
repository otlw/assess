import { Action } from './actions'

export type NavigationState = {
  dashboardTab: 'Current' | 'Available' | 'Past'
  mainDisplay: 'Main' | 'UnlockMetamask' | 'NoMetamask' | 'UndeployedNetwork'
  notificationBar:
    { display: false } |
    {
      display: true
      type: 'success' | 'error'
    },
  inputBar: string,
  showHiddenCards: boolean,
  visits: {
    site: number,
    assessor: 0 | 1 | 2 | 3 | 4,
    assessee: 0 | 1 | 2 | 3 | 4,
  }
}

const initialState:NavigationState = {
  dashboardTab: 'Current',
  mainDisplay: 'Main',
  notificationBar: {
    display: false
  },
  inputBar: '',
  showHiddenCards: false,
  visits: {
    site: 0,
    assessor: 0,
    assessee: 0
  }
}

export function NavigationReducer (state = initialState, action:Action):NavigationState {
  switch (action.type) {
    case 'SET_DASHBOARD_TAB':
      return {
        ...state,
        dashboardTab: action.dashboardTab
      }
    case 'SET_MAIN_DISPLAY':
      return {
        ...state,
        mainDisplay: action.mainDisplay
      }
    case 'SET_NOTIFICATION_BAR':
      return {
        ...state,
        notificationBar: action.notificationBar
      }
    case 'SET_INPUT_BAR':
      return {
        ...state,
        inputBar: action.inputBar
      }
    case 'TOGGLE_HIDDEN_CARDS':
      return {
        ...state,
        showHiddenCards: !state.showHiddenCards
      }
    case 'ADD_VISIT':
      return {
        ...state,
        visits: {
          ...state.visits,
          site: state.visits.site + 1
        }
      }
      /*
        case SAVE_PROGRESSION:
          return {
              ...state,
              visits: {
                  ...state.visits,
                  [action.role]: action.stage > state.visits[action.role] ? action.stage : state.visits[action.role]
              }
          }
      */

    default: return state
  }
}
