import { getInstance } from '../../utils'
import { Dispatch } from 'redux'
import { sendAndReactToTransaction } from '../transaction/asyncActions'
import { receiveConcepts } from './actions'
import { TransactionReceipt, EventLog } from 'web3/types'

export function loadConceptsFromConceptRegistery (currentBlock:number) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    const conceptRegistryInstance:any = getInstance.conceptRegistry(getState())
    // get concepts from registry
    let pastevents:EventLog[] = await conceptRegistryInstance.getPastEvents('ConceptCreation', {
      fromBlock: getState().ethereum.lastUpdatedAt,
      toBlock: currentBlock
    })

    let concepts:any = {}
    await Promise.all(pastevents.map(async (event:EventLog) => {
      let conceptAddress:string = event.returnValues._concept
      // instanciate Concept Contract to get 'data' (ie the name of the concept)
      let conceptInstance:any = getInstance.concept(getState(), conceptAddress)

      // get and decode data
      let hash:string = await conceptInstance.methods.data().call()
      let decodedConceptDataHash:string = hash ? Buffer.from(hash.slice(2), 'hex').toString('utf8') : 'no data'
      let decodedConceptData:any

      // retrieve JSON from IPFS if the data is an IPFS hash
      if (decodedConceptDataHash.substring(0, 2) === 'Qm') {
        // setup ipfs api
        const ipfsAPI:any = require('ipfs-api')
        const ipfs:any = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

        // verify that description is correctly stord and log it
        let resp:any[] = await ipfs.get(decodedConceptDataHash)
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

      return (concepts[conceptAddress] = decodedConceptData)
    }))
    dispatch(receiveConcepts(concepts))
    return concepts
  }
}

type callbacksType= {
  transactionHash: (hash: string) => void | null,
  confirmation: (status: boolean, receipt: TransactionReceipt | Error) => void,
  error: (error: Error) => void
}

// combination of two functions above for directly creating assessments from conceptList
export function loadConceptContractAndCreateAssessment (conceptAddress:string, cost:number, callbacks:callbacksType) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    let userAddress:string = getState().ethereum.userAddress
    let conceptInstance:any = getInstance.concept(getState(), conceptAddress)
    const size:number = 5
    const endTime:number = 7 * 24 * 3600
    const startTime:number = 3 * 24 * 3600
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
export function estimateAssessmentCreationGasCost (conceptAddress:string, cost:number, callBack:(number)=>any) {
  return async (dispatch: Dispatch<any, any>, getState: any) => {
    // instanciate Concept Contract
    let userAddress = getState().ethereum.userAddress
    let conceptInstance = getInstance.concept(getState(), conceptAddress)
    const size = 5
    const endTime = 7 * 24 * 3600
    const startTime = 3 * 24 * 3600
    // use estimateGas to get transaction gas cost before it is published
    let estimate:number = await conceptInstance.methods.makeAssessment(cost * 1e9, size, startTime, endTime).estimateGas({from: userAddress, gas: 3000000})
    // then get current gasPrice
    let gasPrice:number = await getState().ethereum.web3.eth.getGasPrice()
    // then convert it to eth from wei and multiply it by the estimate
    callBack(estimate * getState().ethereum.web3.utils.fromWei(gasPrice.toString(), 'ether'))
  }
}
