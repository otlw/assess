import {Dispatch} from 'redux'
import Web3 from 'web3'
import {setMetamaskLoadingStage} from './actions'
import {setModal} from '../navigation/actions'
import {web3Connected, receiveVariable} from '../web3/actions'
import {loadPersistedState} from '../web3/asyncActions'

export const ConnectMetamask = () => {
  return async (dispatch:Dispatch<any, any>) => {
    console.log('yo?')
    if (typeof typeof (window as any)['web3'] === 'undefined') {
      dispatch(setModal("NoMetaMask"))
      return dispatch(setMetamaskLoadingStage('Error'))
    }

    let web3 = new Web3((window as any)['web3'].currentProvider)
    let accounts = await web3.eth.getAccounts()
    let networkID = await web3.eth.net.getId()


    // Set up a watcher to reload on changes to metamask
    setInterval(async () => {
      if(networkID !== await web3.eth.net.getId() ||
         accounts[0] !== (await web3.eth.getAccounts())[0]) {
        window.location.reload()
      }
    }, 1000)

    if (accounts.length === 0) {
      dispatch(setModal("UnlockMetaMask"))
      return dispatch(setMetamaskLoadingStage('Error'))
    }

    dispatch(web3Connected(web3))
    dispatch(receiveVariable('userAddress', accounts[0]))
    dispatch(receiveVariable('networkID', networkID))
    dispatch(loadPersistedState(networkID, accounts[0], web3))
    return dispatch(setMetamaskLoadingStage('Loaded'))

  }
}
