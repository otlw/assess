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
  confirmationCallback: (status: boolean, receipt: TransactionReceipt | Error) => void) {

  // transaction.method(...transaction.args).send({from: userAddress, gas: gas || 320000})
  transaction()
    .on('transactionHash', (hash: string) => {

      // right after the transaction is published
      // confirmationCallback(false, hash)
      dispatch(saveTransaction(assessmentAddress, userAddress, saveData, hash))
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
      if (confirmationCallback && confirmationNumber === 9) {

        if (receipt.status) {
          confirmationCallback(false, receipt)

        } else {
          confirmationCallback(true, receipt)

        }
      }
    })
    .on('error', (err: Error) => {
      // when there is an error
      console.log('err', err)
      confirmationCallback(true, err)
    })
}
