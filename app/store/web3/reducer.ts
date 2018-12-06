import extend from 'xtend'
import Web3 from 'web3'

import { Actions } from './actions'
var web3 = new Web3()

export type EthereumState = {
  web3: Web3
  isConnected: boolean
  web3_version: string
  userAddress: string
  networkID: number
  AhaBalance: number
  lastUpdatedAt: number
  deployedFathomTokenAt: number | null
  deployedConceptRegistryAt: number | null
}

let initialState: EthereumState = {
  web3: web3,
  isConnected: false,
  web3_version: 'none',
  userAddress: '',
  networkID: 4,
  AhaBalance: 0,
  lastUpdatedAt: 0,
  deployedFathomTokenAt: null,
  deployedConceptRegistryAt: null
}

export function EthereumReducer (state = initialState, action: Actions): EthereumState {
  switch (action.type) {
  case 'WEB3_CONNECTED':
    return {
      ...state,
      web3: action.payload.web3,
      isConnected: true,
      web3_version: action.payload.web3.version
    }
  case 'WEB3_DISCONNECTED':
    return {
      ...state,
      web3: web3, // {},
      isConnected: false,
      web3_version: 'none'
    }
  case 'RECEIVE_VARIABLE':
    return extend(state, { [action.name]: action.value })
  default:
    return state
  }
}
