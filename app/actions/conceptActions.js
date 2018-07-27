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
      let hash = await conceptInstance.methods.data().call()
      let decodedConceptDataHash = Buffer.from(hash.slice(2), 'hex').toString('utf8')
      let decodedConceptData;

      // retrieve JSON from IPFS if the data is an IPFS hash
      if (decodedConceptDataHash.substring(0, 2) === 'Qm') {
        
        // setup ipfs api
        const ipfsAPI = require('ipfs-api')
        const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

        // verify that description is correctly stord and log it
        let resp = await ipfs.get(decodedConceptDataHash)
        decodedConceptData = resp[0].content.toString()

        //parse JSON
        decodedConceptData= JSON.parse(decodedConceptData)
      } else {
        //if no ipfs hash, just use data string decodedConceptDataHash
        decodedConceptData = {
          name:decodedConceptDataHash,
          description:decodedConceptDataHash
        }
      }

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
  // TODO handle the case where cost===0 (that throws an exception)
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let conceptInstance = getInstance.concept(getState(), address)
    const size = 5
    const endTime = 4 * 24 * 3600
    const startTime = 3 * 24 * 3600
    sendAndReactToTransaction(
      dispatch,
      () => {
        return conceptInstance.methods.makeAssessment(
          cost, size, startTime, endTime
        ).send({from: userAddress})
      },
      'makeAssessment',
      userAddress,
      address,
      callback,
      3000000 // weirdly, this transaction will only go through with a high gas price (testnet)
    )
  }
}

// estimate the gas of the transaction above
export function estimateAssessmentCreationGasCost (address, cost, cllbck) {
  // TODO handle the case where cost===0 (that throws an exception)
  return async (dispatch, getState) => {
    // instanciate Concept Contract
    let userAddress = getState().ethereum.userAddress
    let conceptInstance = getInstance.concept(getState(), address)
    const size = 5
    const endTime = 4 * 24 * 3600
    const startTime = 3 * 24 * 3600
    // use estimateGas to get transaction gas cost before it is published
    let estimate = await conceptInstance.methods.makeAssessment(cost, size, startTime, endTime).estimateGas({from: userAddress, gas: 3000000})
    // then get current gasPrice
    let gasPrice = await getState().ethereum.web3.eth.getGasPrice()
    // then convert it to eth from wei and multiply it by the estimate
    cllbck(estimate * getState().ethereum.web3.utils.fromWei(gasPrice.toString(), 'ether'))
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
