import { EthereumState } from './reducer'

export type Actions =
  ReturnType<typeof web3Connected> |
  ReturnType<typeof web3Disconnected> |
  ReturnType<typeof receiveVariable>

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
