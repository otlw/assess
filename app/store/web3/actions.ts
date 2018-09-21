import { EthereumState } from './reducer'

export type Actions =
  ReturnType<typeof web3Connected> |
  ReturnType<typeof web3EventsConnected> |
  ReturnType<typeof web3Disconnected> |
  ReturnType<typeof receiveVariable> |
  ReturnType<typeof receivePersistedState>

// action to save the connedted web3-instance in state
export function web3Connected (web3: EthereumState['web3']) {
  let type: 'WEB3_CONNECTED' = 'WEB3_CONNECTED'
  return {
    type,
    payload: {
      web3: web3
    }
  }
}

// action to save the websocket web3-instance in state
export function web3EventsConnected (web3: EthereumState['web3']) {
  let type: 'WEB3EVENTS_CONNECTED' = 'WEB3EVENTS_CONNECTED'
  return {
    type,
    payload: {
      web3events: web3
    }
  }
}
// to save in state that one could not connect
export function web3Disconnected () {
  let type: 'WEB3_DISCONNECTED' = 'WEB3_DISCONNECTED'  
  return {
    type,
    payload: {}
  }
}

// to save something from the chain in state
export function receiveVariable (name: string, value: any) {
  let type: 'RECEIVE_VARIABLE' = 'RECEIVE_VARIABLE'
  return {
    type,
    name,
    value
  }
}

// to save something from the chain in state
interface IPersistedState {
  lastUpdatedAt: number
  deployedFathomTokenAt: string
  deployedConceptRegistryAt: string 
}
export function receivePersistedState (persistedState:IPersistedState) {
  let type: 'RECEIVE_PERSISTED_STATE' = 'RECEIVE_PERSISTED_STATE'
  return {
    type,
    persistedState
  }
}
