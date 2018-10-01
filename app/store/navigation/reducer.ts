import { Action } from './actions'

export type ModalTopics =
  null |
  'AssessmentCreation' |
  'UndeployedNetwork' |
  'EducateAboutMetaMask' |
  'NoMetaMask' |
  'AssessmentProcess' |
  'UnlockMetaMask' |
  "AssessmentCreationFailed" |
  "WelcomeAsAssessor" |
  "HowToBeAssessor1" |
  "HowToBeAssessor2" |
  "HowToBeAssessor1" |
  "HowToBeAssessor2" |
  "FailedStake" |
  "FailedStakeAssessor" |
  "FailedStakeWhy" |
  "FailedCommit" |
  "FailedCommitAssessor" |
  "FailedCommitUser" |
  "FailedCommitWhy" |
  "FailedReveal" |
  "FailedRevealAssessor" |
  "FailedRevealUser" |
  "FailedRevealWhy" |
  "InvalidOutcome" |
  "InvalidOutcomeAssessor" |
  "InvalidOutcomeWhy"

export type NavigationState = {
  dashboardTab: 'Current' | 'Available' | 'Past'
  modal: ModalTopics
  notificationBar:
    { display: false } |
    {
      display: true
      type: 'success' | 'error'
    },
  inputBar: string,
  showHiddenCards: boolean
}

const initialState:NavigationState = {
  dashboardTab: 'Current',
  modal: null,
  notificationBar: {
    display: false
  },
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
    default: return state
  }
}
