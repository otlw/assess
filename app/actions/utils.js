const assessmentABI = require('../../build/contracts/Assessment.json').abi
const conceptABI = require('../../build/contracts/Concept.json').abi
const fathomTokenArtifact = require('../../build/contracts/FathomToken.json')
console.log('fathomTokenArtifact ', fathomTokenArtifact )
const conceptRegistryArtifact = require('../../build/contracts/ConceptRegistry.json')

export const Stage = {
  None: 0,
  Called: 1,
  Confirmed: 2,
  Committed: 3,
  Done: 4,
  Burned: 5
}

function getContractInstance (web3, abi, address) {
  console.log('abi', abi)
  return new web3.eth.Contract(abi, address)
}

export const getInstance = {
  assessment: (state, address) => getContractInstance(state.ethereum.web3, assessmentABI, address),
  concept: (state, address) => getContractInstance(state.ethereum.web3, conceptABI, address),
  fathomToken: (state) => {
    return getContractInstance(
      state.ethereum.web3,
      fathomTokenArtifact.abi,
      fathomTokenArtifact.networks[state.ethereum.networkID].address
    )
  },
  conceptRegistry: (state) => {
    return getContractInstance(
      state.ethereum.web3,
      conceptRegistryArtifact.abi,
      conceptRegistryArtifact.networks[state.ethereum.networkID].address
    )
  }
}
