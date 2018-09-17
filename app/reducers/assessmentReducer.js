import {
  RECEIVE_ASSESSMENT,
  RECEIVE_ASSESSOR,
  REMOVE_ASSESSMENT,
  SET_ASSESSMENT_AS_INVALID,
  UPDATE_ASSESSMENT_VARIABLE
} from '../actions/assessmentActions'
import {RECEIVE_PERSISTED_STATE} from '../actions/web3Actions.js'
import extend from 'xtend'

let initialState = {
}

/*
  further assessments are stored like this:

address : {
  cost: 0
  size: 5,
  assessee: 0x...,
  stage: [0,4]
  finalScore: [-127, 127],
  userStage: 0,
  data: {
     address: dataString,
     ...
  },
  payout: 20,
  violation: false,
  refunded: false
  hidden: false
}
 */
function assessments (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ASSESSMENT: {
      let assessmentAddress = action.assessment.address
      return extend(state, {[assessmentAddress]: extend(state[assessmentAddress], action.assessment)})
    }
    case REMOVE_ASSESSMENT: {
      let newStage = {...state}
      delete newStage[action.address]
      return newStage
    }
    case RECEIVE_ASSESSOR: {
      let assessmentAddress = action.address
      let assessment = state[assessmentAddress] || {assessors: []}
      let newAssessors = assessment.assessors.slice(0)
      newAssessors.push(action.assessor)
      return {
        ...state,
        [assessmentAddress]: extend(assessment, {assessors: newAssessors})
      }
    }
    case UPDATE_ASSESSMENT_VARIABLE: {
      return {
        ...state,
        [action.assessmentAddress]: extend(state[action.assessmentAddress], {[action.name]: action.value})
      }
    }
    case SET_ASSESSMENT_AS_INVALID: {
      return {
        ...state,
        [action.assessmentAddress]: {'invalid': true}
      }
    }
    case RECEIVE_PERSISTED_STATE: {
      return action.persistedState.assessments
    }
    default:
      return state
  }
}

export default assessments
