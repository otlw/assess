import { networkName } from './constants.js'
let { Assessment, Concept, FathomToken, ConceptRegistry } = require('fathom-contracts')

function getContractInstance (web3, abi, address) {
  return new web3.eth.Contract(abi, address)
}

export const convertDate = (unixTimestamp) => {
  let date = new Date(unixTimestamp * 1000) // input in milliseconds
  return date.toDateString()
}

export const getInstance = {
  assessment: (state, address) => getContractInstance(state.ethereum.web3, Assessment.abi, address),
  concept: (state, address) => getContractInstance(state.ethereum.web3, Concept.abi, address),
  fathomToken: (state) => {
    if (FathomToken.networks[state.ethereum.networkID] && FathomToken.networks[state.ethereum.networkID].address) {
      return getContractInstance(
        state.ethereum.web3,
        FathomToken.abi,
        FathomToken.networks[state.ethereum.networkID].address
      )
    } else {
      return {error: true}
    }
  },
  conceptRegistry: (state) => {
    return getContractInstance(
      state.ethereum.web3,
      ConceptRegistry.abi,
      ConceptRegistry.networks[state.ethereum.networkID].address
    )
  }
}

// convert score UI/SmartContracts

export function convertFromOnChainScoreToUIScore (x) {
  return (x + 100) / 2
}

export function convertFromUIScoreToOnChainScore (x) {
  return (x * 2) - 100
}

export const getLocalStorageKey = (networkID, userAddress, web3) => {
  // the address of the FathomToken is appended so that redeployments on a local
  // testnet do not show assessment from earlier migrations
  return 'State' + networkName(networkID) + userAddress + FathomToken.networks[networkID].address
}

export const saveState = (state) => {
  if (state.ethereum.isConnected) {
    try {
      let stateToSave = {
        assessments: state.assessments,
        concepts: state.concepts,
        latestBlock: state.ethereum.latestBlock
      }
      let key = getLocalStorageKey(state.ethereum.networkID, state.ethereum.userAddress, state.ethereum.web3)
      const serializedState = JSON.stringify(stateToSave)
      localStorage.setItem(key, serializedState)
    } catch (err) {
      console.log('error saving state', err)
    }
  } else {
    console.log('do not store Store yet')
  }
}
