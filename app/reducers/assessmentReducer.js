import {
  RECEIVE_ASSESSMENT,
  RECEIVE_FINALSCORE,
  RECEIVE_ASSESSMENTSTAGE,
  REMOVE_ASSESSMENT,
  RECEIVE_ASSESSORS,
  RECEIVE_STORED_DATA
  // SET_FETCH_FLAG
} from '../actions/assessmentActions'

import extend from 'xtend'

let initialState = {
  loadingList: false
}
/*
// fetching-Status is stored like this:
loadingList: true/false
loadingSingleView: {
  data: false,
  assessors: false,
  payouts: true
},

assessmentAddress : {
  cost: 0
  size: 5,
  assessee: 0x...,
  stage: [0,4]
  finalScore: [-127, 127],
  assessors : [
    {
      address,
      stage,
    },
    ...
  ]
  storedData: {
     address: dataString,
     ...
  }
}
 */

function assessments (state = initialState, action) {
  let address = action.address
  switch (action.type) {
    case RECEIVE_ASSESSMENT: {
      return extend(state, {[action.assessment.address]: action.assessment})
    }
    case RECEIVE_ASSESSMENTSTAGE: {
      return {
        ...state,
        [address]: extend(state[address], {stage: action.stage})
      }
    }
    case RECEIVE_FINALSCORE: {
      return {
        ...state,
        [address]: extend(state[address], {finalScore: action.finalScore})
      }
    }
    case REMOVE_ASSESSMENT: {
      let newStage = {...state}
      delete newStage[action.address]
      return newStage
    }
    case RECEIVE_ASSESSORS: {
      return {
        ...state,
        [address]: extend(state[address], {assessors: action.assessors})
      }
    }
    case RECEIVE_STORED_DATA: {
      return {
        ...state,
        [address]: extend(state[address], {data: action.data})
      }
    }
    default:
      return state
  }
}

export default assessments
