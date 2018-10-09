import { saveTransaction, updateTransaction } from './actions'
import { Dispatch } from 'redux'
import { TransactionReceipt, PromiEvent } from 'web3/types'

/* sends a transactions to the chain, and saves it into state
   Params:
   @dispatch is needed to send the updates to state
   @transaction is a function that sends a tx to the chain (i.e., it calls a contract method, supplies any expected parameters)
   @userAddress, @assessmentAddress and @purpose are used to mark the place where the transaction was triggered
   @callbacks: callback functions to be called in different transaction circumstances
*/

export function sendAndReactToTransaction (
  dispatch: Dispatch<any, any>,
  transaction: () => PromiEvent<any>,
  purpose: 'makeAssessment' | 'meetingPointChange' | 'refund',
  userAddress: string,
  assessmentAddress: string,
  callbacks: {
    transactionHash: (hash: string) => void | null,
    confirmation: (status: boolean, receipt: TransactionReceipt | Error) => void,
    error: (error: Error) => void
  }
  ) {
  transaction()
    .on('transactionHash', (hash: string) => {
      dispatch(saveTransaction(assessmentAddress, userAddress, purpose, hash))
      if (callbacks.transactionHash) callbacks.transactionHash(hash)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      // TODO: choose a good confirmation number (kovan and rinkeby accept 2, but local textnet requires 8)
      // when the transaction is confirmed into a block
      if (confirmationNumber === 8) {
        dispatch(updateTransaction(
          receipt.transactionHash,
          assessmentAddress,
          userAddress,
          purpose,
          receipt.status ? 'confirmed' : 'failed'
        ))
          if (callbacks.confirmation) {
              if (receipt.status) {
                  callbacks.confirmation(false, receipt)
              } else {
                  callbacks.confirmation(true, receipt)
              }
          }
      }
    })
    .on('error', (err: Error) => {
      // when there is an error
      console.log('err', err)
        if (callbacks.error) callbacks.error(err)
    })
}
