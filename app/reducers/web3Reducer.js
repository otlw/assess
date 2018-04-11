import {
  RECEIVE_VARIABLE,
  WEB3_CONNECTED,
  WEB3_DISCONNECTED,
  RECEIVE_ASSESSMENT,
  SET_ASSESSMENT
} from '../actions/async.js'

let initialState = {
  web3: {},
  web3_version: 'none',
  isConnected: false,
  userAddress: '',
  networkID: 666,
  balance: 0,
  assessments: {'asdfsfd': 1},
  selectedAssessment: ''
}

function web3Reducer (state = initialState, action) {
  console.log('reducer got:', action.type, 'with payload: ', action.payload)

  switch (action.type) {
  case WEB3_CONNECTED:
    return {
      ...state,
      web3: action.payload.web3,
      isConnected: true,
      web3_version: action.payload.web3.version
    }
  case WEB3_DISCONNECTED:
    return {
      ...state,
      web3: {},
      isConnected: false,
      web3_version: 'none'
    }
  case RECEIVE_VARIABLE: {
    let newState = Object.assign({}, state)
    newState[action.payload.name] = action.payload.value
    return newState
  }
  case SET_ASSESSMENT:
    return {
      ...state,
      selectedAssessment: action.payload.address
    }
  case RECEIVE_ASSESSMENT:
    let newState =  {
      ...state,
      assessments: {
        ...state.assessments,
        [action.payload.assessment.address]: action.payload.assessment
      }
    }
    console.log('newState', newState)
    return newState
  default:
    return state
  }
}

export default web3Reducer
