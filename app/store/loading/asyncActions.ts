import { Dispatch } from 'redux'
import Web3 from 'web3'
import { setDataLoadingStage } from './actions'
import { setModal } from '../navigation/actions'
import { loadConceptsFromConceptRegistery } from '../concept/asyncActions'
import { web3Connected, receiveVariable } from '../web3/actions'

export const ConnectData = () => {
  return async (dispatch: Dispatch<any, any>,getState:any) => {

    // First, load web3; TODO : web3 is already loaded in the PersistStoreInstantiator, we could save into the window object and get it here (lets not forget the loop check of address)
    console.log('start')
    dispatch(setDataLoadingStage('Loading'))
    // Modern dapp browsers...
    let web3: any
    if ((window as any)['ethereum']) {
      web3 = new Web3((window as any)['ethereum'])
    } else if ((window as any)['web3']) { // Legacy dapp browsers...
      web3 = new Web3((window as any)['web3'].currentProvider)
      // Acccounts always exposed
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
      return dispatch(setDataLoadingStage('MetaMask Error'))
    }

    dispatch(web3Connected(web3))
    dispatch(receiveVariable('userAddress', accounts[0]))
    dispatch(receiveVariable('networkID', networkID))

    // Then, load concepts from concept registery
    await loadConceptsFromConceptRegistery()(dispatch,getState)

    return dispatch(setDataLoadingStage('Loaded'))
  }
}

