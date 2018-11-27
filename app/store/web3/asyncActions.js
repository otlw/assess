import { getInstance, hmmmToAha, getBlockDeployedAt } from '../../utils'
import { setModal } from '../navigation/actions'
import { receiveVariable } from './actions'
import { modalTopic } from '../../components/Helpers/helperContent'

export const loadFathomNetworkParams = () => {
  return async (dispatch, getState) => {
    // ONLY ONCE!: looking up when contracts were deployed
    let deployedFathomTokenAt = Number(await getBlockDeployedAt.fathomToken(getState()))
    let deployedConceptRegistryAt = Number(await getBlockDeployedAt.conceptRegistry(getState()))
    dispatch(receiveVariable('deployedFathomTokenAt', deployedFathomTokenAt))
    dispatch(receiveVariable('deployedConceptRegistryAt', deployedConceptRegistryAt))
  }
}

export const fetchUserBalance = () => {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let fathomTokenInstance = getInstance.fathomToken(getState())
    if (fathomTokenInstance.error) {
      dispatch(setModal(modalTopic.UndeployedNetwork))
    } else {
      let userBalance = hmmmToAha(await fathomTokenInstance.methods.balanceOf(userAddress).call())
      dispatch(receiveVariable('AhaBalance', userBalance))
    }
  }
}
