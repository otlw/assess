import {
  RECEIVE_ASSESSMENT,
  RECEIVE_ASSESSOR,
  REMOVE_ASSESSMENT,
  RECEIVE_ASSESSORS,
  RECEIVE_STORED_DATA,
  RECEIVE_PAYOUTS,
  SET_ASSESSMENT
} from '../actions/assessmentActions'

import extend from 'xtend'

let initialState = {
  selectedAssessment: ''
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
  assessorStages : {
      address: Called
      ...
  },
  data: {
     address: dataString,
     ...
  },
  payouts: {
    address1: 20,
    ...
  }
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
    case RECEIVE_ASSESSORS: {
      let address = action.address
      return {
        ...state,
        [address]: extend(state[address], extend(state[address].assessorStages, {assessorStages: action.assessorStages}))
      }
    }
    case RECEIVE_ASSESSOR: {
      let address = action.address
      let assessment = state[address] || {assessorStages: {}}
      let newAssessors = extend(assessment.assessorStages, {[action.assessor]: ''})
      return {
        ...state,
        [address]: extend(assessment, {assessorStages: newAssessors})
      }
    }
    case RECEIVE_STORED_DATA: {
      let address = action.assessmentAddress
      return {
        ...state,
        [address]: extend(state[address], {data: action.data})
      }
    }
    case RECEIVE_PAYOUTS: {
      let address = action.assessmentAddress
      return {
        ...state,
        [address]: extend(state[address], extend(state[address].payouts, {payouts: action.payouts}))
      }
    }
    case SET_ASSESSMENT: {
      return {
        ...state,
        selectedAssessment: action.address
      }
    }
    default:
      return state
  }
}

export default assessments
