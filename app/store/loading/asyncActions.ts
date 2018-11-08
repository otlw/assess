import { Dispatch } from 'redux'
import Web3 from 'web3'
import { setMetamaskLoadingStage } from './actions'
import { setModal } from '../navigation/actions'
import { web3Connected, receiveVariable } from '../web3/actions'

export const ConnectMetamask = () => {
  return async (dispatch: Dispatch<any, any>) => {
    // Modern dapp browsers...
    let web3: any
    if ((window as any)['ethereum']) {
      web3 = new Web3((window as any)['ethereum'])
      try {
        // Request account access if needed
        await (window as any)['ethereum'].enable()
      } catch (error) {
        // User denied account access...
        // TODO setup 'user rejection modal'
        console.log('user rejection')
        return dispatch(setMetamaskLoadingStage('Error'))
      }
    } else if ((window as any)['web3']) { // Legacy dapp browsers...
      web3 = new Web3((window as any)['web3'].currentProvider)
      // Acccounts always exposed
    } else { // Non-dapp browsers...
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      dispatch(setModal('NoMetaMask')) // TODO this modal shouldnt be able to be closed
      return dispatch(setMetamaskLoadingStage('Error'))
    }

    let accounts = await web3.eth.getAccounts()
    let networkID = await web3.eth.net.getId()

    // Set up a watcher to reload on changes to metamask
    setInterval(async () => {
      if (networkID !== await web3.eth.net.getId() ||
         accounts[0] !== (await web3.eth.getAccounts())[0]) {
        window.location.reload()
      }
    }, 1000)

    if (accounts.length === 0) {
      dispatch(setModal('UnlockMetaMask')) // TODO this modal shouldnt be able to be closed
      return dispatch(setMetamaskLoadingStage('Error'))
    }

    dispatch(web3Connected(web3))
    dispatch(receiveVariable('userAddress', accounts[0]))
    dispatch(receiveVariable('networkID', networkID))
    return dispatch(setMetamaskLoadingStage('Loaded'))
  }
}
