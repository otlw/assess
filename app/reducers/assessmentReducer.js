import {
  RECEIVE_ASSESSMENT,
  SET_ASSESSMENT
} from '../actions/async.js'

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
      selectedAssessment: action.payload.address
    }
  case RECEIVE_ASSESSMENT:
    return  {
      ...state,
        [action.payload.assessment.address]: action.payload.assessment
    }
  default:
    return state
  }
}

export default assessments
