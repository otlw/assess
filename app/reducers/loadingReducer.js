import {
  BEGIN_LOADING_ASSESSMENTS,
  END_LOADING_ASSESSMENTS
} from '../actions/assessmentActions.js'

import {loadingStage} from '../actions/utils.js'

let initialState = {
  assessments: loadingStage.None,
  concepts: loadingStage.None,
  web3: loadingStage.None
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
    default:
      return state
  }
}

export default loading
