import {receiveVariable} from "./async.js"

export function loadConceptsFromConceptRegistery () {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    let networkID = getState().networkID

    // instanciate Concept registery Contract
    try {
      var conceptRegistryArtifact = require('../../build/contracts/ConceptRegistry.json')
      var abi = conceptRegistryArtifact.abi
      var contractAddress = conceptRegistryArtifact.networks[networkID].address
    } catch (e) {
      console.error(e)
    }
    const contractInstance = await new w3.eth.Contract(abi, contractAddress)

    // get concepts from registry
    dispatch(listConcepts(w3,contractInstance))
  }
}

export const listConcepts = (w3,conceptRegisteryInstance) => {
  return async (dispatch, getState) => {
    // use concept creation events to list concept addresses
    let pastevents = await conceptRegisteryInstance.getPastEvents('ConceptCreation', {fromBlock: 0, toBlock: 'latest'})

    let conceptList = await Promise.all(pastevents.map(async (e) => {
      // instanciate Concept Contract to get 'data' (ie the name of the concept)
      try {
        var conceptArtifact = require('../../build/contracts/Concept.json')
        var abi = conceptArtifact.abi
      } catch (e) {
        console.error(e)
      }
      let conceptInstance = await new w3.eth.Contract(abi, e.returnValues._concept)

      //get data
      let data= await conceptInstance.methods.data().call()

      //uncode data
      let uncoded=Buffer.from(data.slice(2), 'hex').toString('utf8')

      return {address:e.returnValues._concept,data:uncoded}
    }))
    dispatch(receiveVariable('conceptList', conceptList))
  }
}