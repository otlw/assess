import { saveTransaction, updateTransaction } from './actions'
import { Dispatch } from 'redux'
import { TransactionReceipt, PromiEvent } from 'web3/types'

/* sends a transactions to the chain, and saves it into state
   Params:
   @dispatch is needed to send the updates to state
   @transaction is a function that sends a tx to the chain (i.e., it calls a contract method, supplies any expected parameters)
   @userAddress, @assessmentAddress and @saveData are used to mark the place where the transaction was triggered
   @confirmationCallback: a function to be called once the transaction has been confirmed
*/

export function sendAndReactToTransaction (
  dispatch: Dispatch<any, any>,
  transaction: () => PromiEvent<any>,
  saveData: 'makeAssessment' | 'meetingPointChange' | 'refund',
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
      dispatch(saveTransaction(assessmentAddress, userAddress, saveData, hash))
      if (callbacks.transactionHash) callbacks.transactionHash(hash)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      // TODO: choose a good confirmation number (kovan and rinkeby accept 2, but local textnet requires 8)
      // when the transaction is confirmed into a block
      if (confirmationNumber === 8) {
        dispatch(updateTransaction(
          receipt.transactionHash,
          receipt.status ? 'Tx confirmed' : 'Tx failed'
        ))
      }
      // invoke callback a tad later, so that the user can see the the tx being confirmed and then see 
      // the site change as a result
      if (callbacks.confirmation && confirmationNumber === 9) {
        if (receipt.status) {
          callbacks.confirmation(false, receipt)

        } else {
          callbacks.confirmation(true, receipt)

        }
      }
    })
    .on('error', (err: Error) => {
      // when there is an error
      console.log('err', err)
        if (callbacks.error) callbacks.error(err)
    })
}
