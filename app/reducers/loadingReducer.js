import {
  BEGIN_LOADING_ASSESSMENTS,
  BEGIN_LOADING_DETAIL,
  END_LOADING_ASSESSMENTS,
  END_LOADING_DETAIL
} from '../actions/assessmentActions.js'

import {loadingStage} from '../actions/utils.js'

let initialState = {
  assessments: loadingStage.None,
  concepts: loadingStage.None,
  web3: loadingStage.None,
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
    case BEGIN_LOADING_DETAIL: {
      console.log('began loading', action.detail)
      return {
        ...state,
        assessmentDetail: {
          ...state.assessmentDetail,
          [action.detail]: loadingStage.Loading
        }
      }
    }
    case END_LOADING_DETAIL: {
      console.log('ended loading', action.detail)
      return {
        ...state,
        assessmentDetail: {
          ...state.assessmentDetail,
          [action.detail]: loadingStage.Done
        }
      }
    }
    default:
      return state
  }
}

export default loading
