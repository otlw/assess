import {Dispatch} from 'redux'
import Web3 from 'web3'
import { setMetamaskLoadingStage, setHistoryLoadingStage } from './actions'
import { setModal, addVisit, receiveVisitHistory } from '../navigation/actions'
import {web3Connected, receiveVariable, receivePersistedState} from '../web3/actions'
import {receiveAllAssessments} from '../assessment/actions'
import {receiveConcepts} from '../concept/actions'
import {getLocalStorageKey} from '../../utils.js'

export const ConnectMetamask = () => {
  return async (dispatch:Dispatch<any, any>) => {
    if (typeof (window as any)['web3'] === 'undefined') {
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
    return dispatch(setMetamaskLoadingStage('Loaded'))

  }
}

export const loadPersistedState = (networkID:number, userAddress:string, web3:Web3) => {
  return async (dispatch:Dispatch<any, any>) => {
    try {
      let key = getLocalStorageKey(networkID, userAddress, web3)
      // let key = networkName(networkID) + 'State' + userAddress
      const serializedState = localStorage.getItem(key) // eslint-disable-line no-undef
      if (serializedState === null) {
        return
      }
      let persistedState = JSON.parse(serializedState)
      if (persistedState.assessments) {
        dispatch(receiveAllAssessments(persistedState.assessments))
      }
      if (persistedState.concepts) {
        dispatch(receiveConcepts(persistedState.concepts))
      }
      if (persistedState.visits) {
        dispatch(receiveVisitHistory(persistedState.visits))
      }
      dispatch(receivePersistedState(persistedState))
      dispatch(addVisit())
      return dispatch(setHistoryLoadingStage('Loaded'))
    } catch (e) {
      console.log('ERROR reading from localStorage')
      return dispatch(setHistoryLoadingStage('Error'))
    }
  }
}
