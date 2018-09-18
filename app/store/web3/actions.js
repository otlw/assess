export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3EVENTS_CONNECTED = 'WEB3EVENTS_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'
export const RECEIVE_VARIABLE = 'RECEIVE_VARIABLE'
export const RECEIVE_PERSISTED_STATE = 'RECEIVE_PERSISTED_STATE'

// action to save the connedted web3-instance in state
export function web3Connected (web3) {
  return {
    type: WEB3_CONNECTED,
    payload: {
      web3: web3,
      version: web3.version
    }
  }
}

// action to save the websocket web3-instance in state
export function web3EventsConnected (web3) {
  return {
    type: WEB3EVENTS_CONNECTED,
    payload: {
      web3events: web3
    }
  }
}
// to save in state that one could not connect
export function web3Disconnected () {
  return {
    type: WEB3_DISCONNECTED,
    payload: {}
  }
}

// to save something from the chain in state
export function receiveVariable (name, value) {
  return {
    type: RECEIVE_VARIABLE,
    name,
    value
  }
}

// to save something from the chain in state
export function receivePersistedState (persistedState) {
  return {
    type: RECEIVE_PERSISTED_STATE,
    persistedState
  }
}
