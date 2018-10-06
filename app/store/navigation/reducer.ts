import { Action } from './actions'

export type ModalTopics =
  null |
  'AssessmentCreation' |
  'UndeployedNetwork' |
  'EducateAboutMetaMask' |
  'NoMetaMask' |
  'AssessmentProcess' |
  'UnlockMetaMask' |
  'AssessmentCreationFailed' |
  'Smues'

export type helperBarTopics =
    null |
    'Staking' |
    'Committing' |
    'Revealing' |
    'ConfirmedStake' |
    'ConfirmedCommit' |
    'ConfirmedReveal' |
    'FirstTimeMeetingPointSet' |
    'MeetingPointChanged' |
    'ChallengePeriodActive'

export type NavigationState = {
  dashboardTab: 'Current' | 'Available' | 'Past'
  modal: ModalTopics
  helperBar: helperBarTopics,
  inputBar: string,
  showHiddenCards: boolean
}

const initialState:NavigationState = {
  dashboardTab: 'Current',
  modal: null,
  helperBar: null,
  inputBar: '',
  showHiddenCards: false
}

export function NavigationReducer (state = initialState, action:Action):NavigationState {
  switch (action.type) {
    case 'SET_DASHBOARD_TAB':
      return {
        ...state,
        dashboardTab: action.dashboardTab
      }
    case 'SET_MODAL':
      return {
        ...state,
        modal: action.modal
      }
    case 'SET_HELPERBAR':
        return {
            ...state,
            helperBar: action.helperBar
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
    default: return state
  }
}
