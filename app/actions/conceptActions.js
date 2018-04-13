export const RECEIVE_CONCEPTS = 'RECEIVE_CONCEPTS'

export function loadConceptsFromConceptRegistery () {
  return async (dispatch, getState) => {
    let w3 = getState().ethereum.web3
    let networkID = getState().ethereum.networkID

    // instanciate Concept registery Contract
    const conceptRegistryArtifact = require('../../build/contracts/ConceptRegistry.json')
    const abi = conceptRegistryArtifact.abi
    let conceptRegistryAddress = conceptRegistryArtifact.networks[networkID].address
    const conceptRregistryInstance = await new w3.eth.Contract(abi, conceptRegistryAddress)

    // get concepts from registry
    dispatch(listConcepts(conceptRregistryInstance))
  }
}

export const listConcepts = (conceptRegistryInstance) => {
  return async (dispatch, getState) => {
    let w3 = getState().ethereum.web3

    // use concept creation events to list concept addresses
    let pastevents = await conceptRegistryInstance.getPastEvents('ConceptCreation', {fromBlock: 0, toBlock: 'latest'})

    let conceptList = await Promise.all(pastevents.map(async (event) => {
      // instanciate Concept Contract to get 'data' (ie the name of the concept)
      const conceptArtifact = require('../../build/contracts/Concept.json')
      const abi = conceptArtifact.abi
      let conceptInstance = await new w3.eth.Contract(abi, event.returnValues._concept)

      // get data
      let data = await conceptInstance.methods.data().call()

      // uncode data
      let decodedConceptData = Buffer.from(data.slice(2), 'hex').toString('utf8')

      return {address: event.returnValues._concept, data: decodedConceptData}
    }))
    dispatch(receiveConcepts(conceptList))
  }
}

export function receiveConcepts(concepts) {
  return {
    type: RECEIVE_CONCEPTS,
    concepts
  }
}

// combination of two functions above for directly creating assessments from conceptList
export function loadConceptContractAndCreateAssessment (address) {
  return async (dispatch, getState) => {
    let w3 = getState().ethereum.web3
    let userAddress = getState().userAddress

    // instanciate Concept Contract
    const conceptArtifact = require('../../build/contracts/Concept.json')
    const abi = conceptArtifact.abi
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
