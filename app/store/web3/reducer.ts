import extend from 'xtend'
import Web3 from 'web3'
var web3 = new Web3()

import { Actions } from './actions'

export type EthereumState = {
  web3: Web3
  isConnected: boolean
  userAddress: string
  networkID: number
  AhaBalance: number
  lastUpdatedAt: number
  deployedFathomTokenAt: string
  deployedConceptRegistryAt: string  
}

let initialState:EthereumState = {
  web3: web3,
  isConnected: false,
  userAddress: '',
  networkID: 4,
  AhaBalance: 0,
  lastUpdatedAt: 0,
  deployedFathomTokenAt: '',
  deployedConceptRegistryAt: ''
}

export function EthereumReducer (state = initialState, action:Actions):EthereumState {
  switch (action.type) {
    case 'WEB3_CONNECTED':
      return {
        ...state,
        web3: action.payload.web3,
        isConnected: true,
      }
    case 'WEB3_DISCONNECTED':
      return {
        ...state,
        web3: web3, // {},
        isConnected: false,
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
