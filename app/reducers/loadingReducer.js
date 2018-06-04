import {
  BEGIN_LOADING_ASSESSMENTS,
  END_LOADING_ASSESSMENTS,
  BEGIN_LOADING_DETAIL,
  END_LOADING_DETAIL,
  RESET_LOADED_DETAILS
} from '../actions/assessmentActions.js'

import {
  BEGIN_LOADING_CONCEPTS,
  END_LOADING_CONCEPTS
} from '../actions/conceptActions.js'

import {loadingStage} from '../actions/utils.js'

let initialState = {
  assessments: loadingStage.None,
  concepts: loadingStage.None,
  assessmentDetail: {
    info: loadingStage.None,
    assessors: loadingStage.None,
    attachments: loadingStage.None,
    payouts: loadingStage.None
  }
}

function loading (state = initialState, action) {
  switch (action.type) {
    case BEGIN_LOADING_ASSESSMENTS:
      return {
        ...state,
        assessments: loadingStage.Loading
      }
    case END_LOADING_ASSESSMENTS: {
      return {
        ...state,
        assessments: loadingStage.Done
      }
    }
    case BEGIN_LOADING_CONCEPTS:
      return {
        ...state,
        concepts: loadingStage.Loading
      }
    case END_LOADING_CONCEPTS: {
      return {
        ...state,
        concepts: loadingStage.Done
      }
    }
    case BEGIN_LOADING_DETAIL: {
      // console.log('began loading', action.detail)
      return {
        ...state,
        assessmentDetail: {
          ...state.assessmentDetail,
          [action.detail]: loadingStage.Loading
        }
      }
    }
    case END_LOADING_DETAIL: {
      // console.log('ended loading', action.detail)
      return {
        ...state,
        assessmentDetail: {
          ...state.assessmentDetail,
          [action.detail]: loadingStage.Done
        }
      }
    }
    case RESET_LOADED_DETAILS:
      return {
        ...state,
        assessmentDetail: initialState.assessmentDetail
      }
    default:
      return state
  }
}

export default loading
