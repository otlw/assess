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
  showHiddenCards: boolean,
  visits: VisitState
}

export type VisitState = {
  site: number,
  assessor: 0 | 1 | 2 | 3 | 4,
  assessee: 0 | 1 | 2 | 3 | 4,
  hasSeenConcepts: boolean
  hasCreatedAssessment: boolean
}

const initialState:NavigationState = {
  dashboardTab: 'Current',
  modal: null,
  helperBar: null,
  inputBar: '',
  showHiddenCards: false,
  visits: {
    site: 0,
    assessor: 0,
    assessee: 0,
    hasSeenConcepts: false,
    hasCreatedAssessment: false
  }
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
    case 'RECEIVE_VISIT_HISTORY':
      return {
        ...state,
        visits: action.visits
      }
    case 'ADD_VISIT':
      return {
        ...state,
        visits: {
          ...state.visits,
          site: state.visits.site + 1
        }
      }
    case 'RESET_VISITS':
      return {
        ...state,
        visits: {
          site: 0,
          assessor: 0,
          assessee: 0,
          hasSeenConcepts: false,
          hasCreatedAssessment: false
        }
      }
    case 'HAS_DONE_X':
      return {
        ...state,
        visits: {
          ...state.visits,
          [action.activity]: true
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
