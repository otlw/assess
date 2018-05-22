import {
  RECEIVE_VARIABLE,
  WEB3_CONNECTED,
  WEB3_DISCONNECTED
} from '../actions/web3Actions.js'

import extend from 'xtend'

let initialState = {
  web3: {},
  web3_version: 'none',
  isConnected: false,
  userAddress: '',
  networkID: null,
  AhaBalance: 0,
  conceptList: []
}

function ethereum (state = initialState, action) {
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
    case RECEIVE_VARIABLE:
      return extend(state, {[action.name]: action.value})
    default:
      return state
  }
}

export default ethereum
