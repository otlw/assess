import {receiveVariable} from './async.js'

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
    dispatch(listConcepts(contractInstance))
  }
}

export const listConcepts = (conceptRegistryInstance) => {
  return async (dispatch, getState) => {
    let w3 = getState().web3

    // use concept creation events to list concept addresses
    let pastevents = await conceptRegistryInstance.getPastEvents('ConceptCreation', {fromBlock: 0, toBlock: 'latest'})

    let conceptList = await Promise.all(pastevents.map(async (e) => {
      // instanciate Concept Contract to get 'data' (ie the name of the concept)
      try {
        var conceptArtifact = require('../../build/contracts/Concept.json')
        var abi = conceptArtifact.abi
      } catch (e) {
        console.error(e)
      }
      let conceptInstance = await new w3.eth.Contract(abi, e.returnValues._concept)

      // get data
      let data = await conceptInstance.methods.data().call()

      // uncode data
      let uncoded = Buffer.from(data.slice(2), 'hex').toString('utf8')

      return {address: e.returnValues._concept, data: uncoded}
    }))
    dispatch(receiveVariable('conceptList', conceptList))
  }
}

// combination of two functions above for directly creating assessments from conceptList
export function loadConceptContractAndCreateAssessment (address) {
  return async (dispatch, getState) => {
    let w3 = getState().web3
    let userAddress = getState().userAddress

    // instanciate Concept Contract
    try {
      var conceptArtifact = require('../../build/contracts/Concept.json')
      var abi = conceptArtifact.abi
    } catch (e) {
      console.error(e)
    }
    let conceptInstance = await new w3.eth.Contract(abi, address)

    // define constants for assessments => those could be move to a config file
    const cost = 10
    const size = 5
    const endTime = 1000000000000
    const startTime = 1000000000
    const assesseeAddress = userAddress
    // this is were a status should be set to "waiting for assessment creation"
    let tx = await conceptInstance.methods.makeAssessment(cost, size, startTime, endTime).send({from: assesseeAddress, gas: 3200000})
    console.log(tx)
    // this is were a status should be set to "assessment created"
  }
}
