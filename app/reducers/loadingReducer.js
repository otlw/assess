import {
  BEGIN_LOADING_ASSESSMENTS,
  END_LOADING_ASSESSMENTS
} from '../actions/assessmentActions.js'

import {
  BEGIN_LOADING_CONCEPTS,
  END_LOADING_CONCEPTS
} from '../actions/conceptActions.js'

import {LoadingStage} from '../constants.js'

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

function loading (state = initialState, action) {
  switch (action.type) {
    case BEGIN_LOADING_ASSESSMENTS:
      return {
        ...state,
        assessments: LoadingStage.Loading
      }
    case END_LOADING_ASSESSMENTS: {
      return {
        ...state,
        assessments: LoadingStage.Done
      }
    }
    case BEGIN_LOADING_CONCEPTS:
      return {
        ...state,
        concepts: LoadingStage.Loading
      }
    case END_LOADING_CONCEPTS: {
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
