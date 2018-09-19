import {Actions} from './actions'
import { LoadingStage } from '../../constants'

let initialState = {
  assessments: LoadingStage.None,
  concepts: LoadingStage.None,
  assessmentDetail: {
    info: LoadingStage.None,
    assessors: LoadingStage.None,
    attachments: LoadingStage.None,
    payouts: LoadingStage.None
  }
}

function loading (state = initialState, action:Actions) {
  switch (action.type) {
    case "BEGIN_LOADING_ASSESSMENTS":
      return {
        ...state,
        assessments: LoadingStage.Loading
      }
    case "END_LOADING_ASSESSMENTS": {
      return {
        ...state,
        assessments: LoadingStage.Done
      }
    }
    case "BEGIN_LOADING_CONCEPTS":
      return {
        ...state,
        concepts: LoadingStage.Loading
      }
    case "END_LOADING_CONCEPTS": {
      return {
        ...state,
        concepts: LoadingStage.Done
      }
    }
    default:
      return state
  }
}

export default loading
