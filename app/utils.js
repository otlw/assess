const assessmentABI = require('../build/contracts/Assessment.json').abi
const conceptABI = require('../build/contracts/Concept.json').abi
const fathomTokenArtifact = require('../build/contracts/FathomToken.json')
const conceptRegistryArtifact = require('../build/contracts/ConceptRegistry.json')

function getContractInstance (web3, abi, address) {
  return new web3.eth.Contract(abi, address)
}

export const convertDate = (unixTimestamp) => {
  let date = new Date(unixTimestamp * 1000) // input in milliseconds
  return date.toDateString()
}

export const getInstance = {
  assessment: (state, address) => getContractInstance(state.ethereum.web3, assessmentABI, address),
  concept: (state, address) => getContractInstance(state.ethereum.web3, conceptABI, address),
  fathomToken: (state) => {
    if (fathomTokenArtifact.networks[state.ethereum.networkID] && fathomTokenArtifact.networks[state.ethereum.networkID].address) {
      return getContractInstance(
        state.ethereum.web3,
        fathomTokenArtifact.abi,
        fathomTokenArtifact.networks[state.ethereum.networkID].address
      )
    } else {
      return {error: true}
    }
  },
  conceptRegistry: (state) => {
    return getContractInstance(
      state.ethereum.web3,
      conceptRegistryArtifact.abi,
      conceptRegistryArtifact.networks[state.ethereum.networkID].address
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
