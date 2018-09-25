/* eslint-disable */
import { saveTransaction, updateTransaction } from './actions'

/* sends a transactions to the chain, and saves it into state
   Params:
   @dispatch is needed to send the updates to state
   @act is a function that sends a tx to the chain (i.e., it calls a contract method, supplies any expected parameters)
   @userAddress, @assessmentAddress and @saveData are used to mark the place where the transaction was triggered
   @confirmationCallback: a function to be called once the transaction has been confirmed
*/
export function sendAndReactToTransaction (dispatch, act, saveData, userAddress, assessmentAddress, confirmationCallback) {

  // act.method(...act.args).send({from: userAddress, gas: gas || 320000})
  act()
    .on('transactionHash', (hash) => {

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
    .on('error', (err) => {
      // when there is an error
      console.log('err', err)
      confirmationCallback(true, err)
    })
}
/* eslint-enable */
