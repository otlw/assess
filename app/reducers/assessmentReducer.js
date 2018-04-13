import {
  RECEIVE_ASSESSMENT,
  RECEIVE_ASSESSORS,
  SET_ASSESSMENT
} from '../actions/assessmentActions'

import extend from 'xtend'

let initialState = {
  selectedAssessment: '',
  '0xdummy' : {
    cost: 10000,
    size: 5,
    assessee: 'DonaldDuck',
    address: '0xdummy',
    assessors: ['tick', 'trick', 'track']
  }
}

function assessments (state = initialState, action) {
  // console.log('assessment-reducer got:', action.type, 'with payload: ', action.payload)
  switch (action.type) {
  case SET_ASSESSMENT:
    return {
      ...state,
      selectedAssessment: action.address
    }
  case RECEIVE_ASSESSMENT: {
    return extend(state, {[action.assessment.address]: action.assessment})
  }
  case RECEIVE_ASSESSORS:
    console.log('assessment-reducer got:', action.type, 'with payload: ', action)
    let address = action.address
    return  {
      ...state,
      [address]: extend(state[address], {assessors:action.assessors})
    }
  default:
    return state
  }
}

export default assessments
