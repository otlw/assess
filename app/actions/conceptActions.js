import { getInstance } from '../utils.js'
import { sendAndReactToTransaction } from './transActions.js'
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
export function loadConceptContractAndCreateAssessment (address, cost, callback) {
  return async (dispatch, getState) => {
    // instanciate Concept Contract
    let userAddress = getState().ethereum.userAddress
    let conceptInstance = getInstance.concept(getState(), address)
    const size = 5
    const endTime = 10000000
    const startTime = 100000
    sendAndReactToTransaction(
      dispatch,
      {method: conceptInstance.methods.makeAssessment, args: [cost, size, startTime, endTime]},
      'makeAssessment',
      userAddress,
      address,
      callback, // we need a callback to update concept creation to step 3 when the transaction is confirmed
      3000000 // weirdly, this transaction will only go through with a high gas price (testnet)
    )
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
