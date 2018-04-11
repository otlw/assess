import {receiveVariable} from "./async.js"

export function loadConceptsFromConceptRegistery () {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    let networkID = getState().networkID

    // instanciate Concept registery Contract
    try {
      var conceptRegistryArtifact = require('../../build//contracts/ConceptRegistry.json')
      var abi = conceptRegistryArtifact.abi
      var contractAddress = conceptRegistryArtifact.networks[networkID].address
    } catch (e) {
      console.error(e)
    }
    const contractInstance = await new w3.eth.Contract(abi, contractAddress)

    // get concepts from registry
    dispatch(listConcepts(contractInstance))
  }
}

export const listConcepts = (conceptRegisteryInstance) => {
  return async (dispatch, getState) => {
    // use concept creation events to list concept addresses
    let pastevents = await conceptRegisteryInstance.getPastEvents('ConceptCreation', {fromBlock: 0, toBlock: 'latest'})
    let listOfAdresses = pastevents.map((e) => {
      return e.returnValues._concept
    })
    dispatch(receiveVariable('conceptAddressList', listOfAdresses))
  }
}