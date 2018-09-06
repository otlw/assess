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

assessmentAddress : {
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
  hidden: false
}
 */
function assessments (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ASSESSMENT: {
      let address = action.assessment.address
      return extend(state, {[address]: extend(state[address], action.assessment)})
    }
    case REMOVE_ASSESSMENT: {
      let newStage = {...state}
      delete newStage[action.address]
      return newStage
    }
    case RECEIVE_ASSESSOR: {
      let address = action.address
      let assessment = state[address] || {assessors: []}
      let newAssessors = assessment.assessors.slice(0)
      newAssessors.push(action.assessor)
      return {
        ...state,
        [address]: extend(assessment, {assessors: newAssessors})
      }
    }
    case UPDATE_ASSESSMENT_VARIABLE: {
      return {
        ...state,
        [action.address]: extend(state[action.address], {[action.name]: action.value})
      }
    }
    case SET_ASSESSMENT_AS_INVALID: {
      return {
        ...state,
        [action.address]: {'invalid': true}
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
