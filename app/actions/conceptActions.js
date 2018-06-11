import { getInstance } from '../utils.js'
export const RECEIVE_CONCEPTS = 'RECEIVE_CONCEPTS'
export const BEGIN_LOADING_CONCEPTS = 'BEGIN_LOADING_CONCEPTS'
export const END_LOADING_CONCEPTS = 'END_LOADING_CONCEPTS'

export function loadConceptsFromConceptRegistery () {
  return async (dispatch, getState) => {
    dispatch(beginLoadingConcepts())
    const conceptRegistryInstance = getInstance.conceptRegistry(getState())

    // get concepts from registry
    let pastevents = await conceptRegistryInstance.getPastEvents('ConceptCreation', {fromBlock: 0, toBlock: 'latest'})

    let concepts = {}
    await Promise.all(pastevents.map(async (event) => {
      let address = event.returnValues._concept
      // instanciate Concept Contract to get 'data' (ie the name of the concept)
      let conceptInstance = getInstance.concept(getState(), address)

      // get and decode data
      let data = await conceptInstance.methods.data().call()
      let decodedConceptData = Buffer.from(data.slice(2), 'hex').toString('utf8')

      return (concepts[address] = decodedConceptData)
    }))
    dispatch(receiveConcepts(concepts))
    dispatch(endLoadingConcepts())
  }
}

export function receiveConcepts (concepts) {
  return {
    type: RECEIVE_CONCEPTS,
    concepts
  }
}

// combination of two functions above for directly creating assessments from conceptList
export function loadConceptContractAndCreateAssessment (address) {
  return async (dispatch, getState) => {
    // instanciate Concept Contract
    let userAddress = getState().ethereum.userAddress
    let conceptInstance = getInstance.concept(getState(), address)

    // define constants for assessments => those could be move to a config file
    const cost = 10
    const size = 2
    const endTime = 1000000000000
    const startTime = 1000000000
    const assesseeAddress = userAddress
    // this is were a status should be set to "waiting for assessment creation"
    let tx = await conceptInstance.methods.makeAssessment(cost, size, startTime, endTime).send({from: assesseeAddress, gas: 3200000})
    console.log(tx)
    // this is were a status should be set to "assessment created"
  }
}

export function beginLoadingConcepts () {
  return {
    type: BEGIN_LOADING_CONCEPTS
  }
}

export function endLoadingConcepts () {
  return {
    type: END_LOADING_CONCEPTS
  }
}
