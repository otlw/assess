import {
  RECEIVE_ASSESSMENT,
  RECEIVE_FINALSCORE,
  RECEIVE_ASSESSMENTSTAGE,
  REMOVE_ASSESSMENT,
  RECEIVE_ALL_ASSESSMENTS,
  RECEIVE_ASSESSORS,
  SET_ASSESSMENT
} from '../actions/assessmentActions'

import extend from 'xtend'

let initialState = {
  selectedAssessment: ''
}

function assessments (state = initialState, action) {
  switch (action.type) {
    case SET_ASSESSMENT:
      return {
        ...state,
        selectedAssessment: action.address
      }
    case RECEIVE_ALL_ASSESSMENTS: {
      return extend(state, action.assessments)
    }
    case RECEIVE_ASSESSMENT: {
      return extend(state, {[action.assessment.address]: action.assessment})
    }
  case RECEIVE_ASSESSMENTSTAGE: {
    let address = action.address
    return {
      ...state,
      [address]: extend(state[address], {stage: action.stage})
    }
  }
  case RECEIVE_FINALSCORE: {
    let address = action.address
    return {
      ...state,
      [address]: extend(state[address], {finalScore: action.finalScore})
    }
  }
  case REMOVE_ASSESSMENT:{
    let newStage = {...state}
    delete newStage[action.address]
    return newStage
  }
  case RECEIVE_ASSESSORS:
    let address = action.address
    return {
      ...state,
      [address]: extend(state[address], {assessors: action.assessors})
    }
  default:
    return state
  }
}

export default assessments
