import { Dispatch } from 'redux'
import Web3 from 'web3'
import { setDataLoadingStage } from './actions'
import { setModal } from '../navigation/actions'
import { loadConceptsFromConceptRegistery } from '../concept/asyncActions'
import { fetchLatestAssessments } from '../assessment/asyncActions'
import { web3Connected, receiveVariable } from '../web3/actions'
import { loadFathomNetworkParams, fetchUserBalance } from '../web3/asyncActions'

export const ConnectData = () => {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    dispatch(setDataLoadingStage('Loading'))

    // First, load web3; TODO : web3 is already loaded in the PersistStoreInstantiator, we could save into the window object and get it here (lets not forget the loop check of address)

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

    // get the user info, fetchBalance doesn't need to be async
    dispatch(receiveVariable('userAddress', accounts[0]))
    dispatch(receiveVariable('networkID', networkID))
    dispatch(fetchUserBalance())

    // Then, look up at which blocks contracts were deployed // NB: We really need those variables to be set before loadConceptsFromConceptRegistery...
    await loadFathomNetworkParams()(dispatch, getState)

    // this is the loading sequence we repeat
    let updateCycle = async () => {
      // Then look up the current block, to be constistant across the loading functions
      let currentBlock = await web3.eth.getBlockNumber()

      // Then, load concepts from concept registery
      await loadConceptsFromConceptRegistery(currentBlock)(dispatch, getState)

      // Then, load assessments from fathmToken events
      await fetchLatestAssessments(currentBlock)(dispatch, getState)

      // We now kno that our data is up to date until currentBlock
      dispatch(receiveVariable('lastUpdatedAt', currentBlock))
    }

    await updateCycle()

    // Start verifying assessment state reglarly TODO: calculate the blocktime depending on network
    let timePeriod = 5000 // Period set to 5sec
    setInterval(async () => {
      await updateCycle()
    }, timePeriod)

    return dispatch(setDataLoadingStage('Loaded'))
  }
}
