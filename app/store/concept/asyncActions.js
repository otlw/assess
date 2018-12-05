import { getInstance } from '../../utils'
import { sendAndReactToTransaction } from '../transaction/asyncActions'
import { receiveConcepts } from './actions'

export function loadConceptsFromConceptRegistery (currentBlock) {
  return async (dispatch, getState) => {
    const conceptRegistryInstance = getInstance.conceptRegistry(getState())
    // get concepts from registry
    let pastevents = await conceptRegistryInstance.getPastEvents('ConceptCreation', {
      fromBlock: getState().ethereum.lastUpdatedAt,
      toBlock: currentBlock
    })

    let concepts = {}
    await Promise.all(pastevents.map(async (event) => {
      let conceptAddress = event.returnValues._concept

      // get concept data
      let decodedConceptData = await getDecodedConceptData(conceptAddress)(dispatch,getState)

      return (concepts[conceptAddress] = decodedConceptData)
    }))
    dispatch(receiveConcepts(concepts))
    return concepts
  }
}

// get the concept data and decode it
export function getDecodedConceptData (conceptAddress) {
  return async (dispatch, getState) => {
    // instanciate Concept Contract to get 'data' (ie the name of the concept)
    let conceptInstance = getInstance.concept(getState(), conceptAddress)

    // get and decode data to retrieve ipfs hash, else keep the string
    let decodedConceptDataHash, decodedConceptData
    let hash = await conceptInstance.methods.data().call()
    decodedConceptDataHash = hash ? Buffer.from(hash.slice(2), 'hex').toString('utf8') : 'No concept data hash'

    // retrieve JSON from IPFS if the data is an IPFS hash
    if (decodedConceptDataHash.substring(0, 2) === 'Qm') {
      // setup ipfs api
      const ipfsAPI = require('ipfs-api')
      const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

      // verify that description is correctly stord and log it
      let resp = await ipfs.get(decodedConceptDataHash)
      decodedConceptData = resp[0].content.toString()

      // parse JSON
      decodedConceptData = JSON.parse(decodedConceptData)
    } else {
      // if no ipfs hash, just use data string decodedConceptDataHash
      decodedConceptData = {
        name: decodedConceptDataHash,
        description: decodedConceptDataHash
      }
    }
    return decodedConceptData
  }
}

// combination of two functions above for directly creating assessments from conceptList
export function loadConceptContractAndCreateAssessment (conceptAddress, cost, callbacks) {
  return async (dispatch, getState) => {
    let userAddress = getState().ethereum.userAddress
    let conceptInstance = getInstance.concept(getState(), conceptAddress)
    const size = 5
    const endTime = 7 * 24 * 3600
    const startTime = 3 * 24 * 3600
    sendAndReactToTransaction(
      dispatch,
      () => {
        return conceptInstance.methods.makeAssessment(
          cost * 1e9, size, startTime, endTime
        ).send({from: userAddress})
      },
      'makeAssessment',
      userAddress,
      conceptAddress,
      callbacks
    )
  }
}

// estimate the gas of the transaction above
export function estimateAssessmentCreationGasCost (conceptAddress, cost, callBack) {
  return async (dispatch, getState) => {
    // instanciate Concept Contract
    let userAddress = getState().ethereum.userAddress
    let conceptInstance = getInstance.concept(getState(), conceptAddress)
    const size = 5
    const endTime = 7 * 24 * 3600
    const startTime = 3 * 24 * 3600
    // use estimateGas to get transaction gas cost before it is published
    let estimate = await conceptInstance.methods.makeAssessment(cost * 1e9, size, startTime, endTime).estimateGas({from: userAddress, gas: 3000000})
    // then get current gasPrice
    let gasPrice = await getState().ethereum.web3.eth.getGasPrice()
    // then convert it to eth from wei and multiply it by the estimate
    callBack(estimate * getState().ethereum.web3.utils.fromWei(gasPrice.toString(), 'ether'))
  }
}
