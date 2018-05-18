import Web3 from 'web3'
import { getInstance } from './utils.js'

export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'
export const RECEIVE_VARIABLE = 'RECEIVE_VARIABLE'

// actions to instantiate web3 related info
export const connect = () => {
  return async (dispatch, getState) => {
    // get web3 object with right provider
    if (typeof window.web3 !== 'undefined') {
      let w3 = new Web3(window.web3.currentProvider)
      // after web3 is instanciated, fetch networkID and user address
      if (w3) {
        dispatch(web3Connected(w3))

        // get networkID
        let networkID = await w3.eth.net.getId()
        dispatch(receiveVariable('networkID', networkID))

        // get userAddress
        let accounts = await w3.eth.getAccounts()
        if (accounts.length === 0) {
          dispatch(receiveVariable('userAddress', 'pleaseEnterPasswordToUnblockMetamask'))
        } else {
          dispatch(receiveVariable('userAddress', accounts[0]))
          // get balance from contract
          let fathomTokenInstance = getInstance.fathomToken(getState())
          let userBalance = await fathomTokenInstance.methods.balanceOf(accounts[0]).call()
          dispatch(receiveVariable('AhaBalance', userBalance))
        }
      } else {
        dispatch(web3Disconnected())
      }
    } else {
      // if no metamask, use rinkeby and set to public View
      let w3 = new Web3('https://rinkeby.infura.io/2FBsjXKlWVXGLhKn7PF7')
      dispatch(web3Connected(w3))
      dispatch(receiveVariable('userAddress', 'publicView'))
    }
  }
}

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
