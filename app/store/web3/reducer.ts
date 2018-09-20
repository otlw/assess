import extend from 'xtend'
import { Web3 } from 'web3'

import { Actions } from './actions'

export type TState = {
  web3: Web3,
  isConnected: boolean,
  web3events: Web3,
  webSocketIsConnected: boolean,
  web3_version: string,
  userAddress: string,
  networkID: number,
  AhaBalance: number,
  lastUpdatedAt: number,
  deployedFathomTokenAt: string,
  deployedConceptRegistryAt: string  
}

let initialState:TState = {
  web3: {},
  isConnected: false,
  web3events: {},
  webSocketIsConnected: false,
  web3_version: 'none',
  userAddress: '',
  networkID: 4,
  AhaBalance: 0,
  lastUpdatedAt: 0,
  deployedFathomTokenAt: '',
  deployedConceptRegistryAt: ''
}

function ethereum (state = initialState, action:Actions) {
  switch (action.type) {
    case 'WEB3_CONNECTED':
      return {
        ...state,
        web3: action.payload.web3,
        isConnected: true,
        web3_version: action.payload.web3.version
      }
    case 'WEB3EVENTS_CONNECTED':
      return {
        ...state,
        web3events: action.payload.web3events,
        webSocketIsConnected: true
      }
    case 'WEB3_DISCONNECTED':
      return {
        ...state,
        web3: {},
        isConnected: false,
        web3_version: 'none'
      }
    case 'RECEIVE_VARIABLE':
      return extend(state, {[action.name]: action.value})
    case 'RECEIVE_PERSISTED_STATE':
      return {
        ...state,
        lastUpdatedAt: action.persistedState.lastUpdatedAt,
        deployedConceptRegistryAt: action.persistedState.deployedConceptRegistryAt,
        deployedFathomTokenAt: action.persistedState.deployedFathomTokenAt
      }
    default:
      return state
  }
}

export default ethereum
