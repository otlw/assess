export const SAVE_TRANSACTION = 'SAVE_TRANSACTION'
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'
export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION'

// note: the data parameter can be used to describes the place where the transaction should be displayed.
// For example the below the assessor-buttons, the data field is expected to be the
// stage of the assessment during which this transaction should be displayed.
export function saveTransaction (address, sender, data, txHash) {
  return {
    type: SAVE_TRANSACTION,
    address,
    sender,
    data,
    txHash
  }
}

export function updateTransaction (txHash, status) {
  return {
    type: UPDATE_TRANSACTION,
    txHash,
    status
  }
}

export function removeTransaction (txHash) {
  return {
    type: REMOVE_TRANSACTION,
    txHash
  }
}

/* sends a transactions to the chain, and saves it into state
   Params:
   @dispatch is needed to send the updates to state
   @act: an object describing the transaction to be sent: {method: functionToBeCalled, args: parameters to be passed}
   @userAddress, @assessmentAddress and @saveData are used to mark the place where the transaction was triggered
   @react: an object describing the method to be called once the first transaction was confirmed
*/
export function sendAndReactToTransaction (dispatch, act, saveData, userAddress, assessmentAddress, react, gas) {
  act.method(...act.args).send({from: userAddress, gas: gas || 320000})
    .on('transactionHash', (hash) => {
      console.log('saving tx')
      dispatch(saveTransaction(assessmentAddress, userAddress, saveData, hash))
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      // TODO: choose a good confirmation number (kovan and rinkeby accept 2, but local textnet requires 8)
      if (confirmationNumber === 8 && receipt.status) {
        console.log('updating tx')
        dispatch(updateTransaction(
          receipt.transactionHash,
          receipt.status ? 'Tx confirmed' : 'Tx failed'
        ))
      }
      if (react && confirmationNumber === 9 && receipt.status) {
        console.log('dispatching reacting')
        dispatch(react.method(...react.args))
      }
    })
    .on('error', (err) => {
      console.log('err', err)
      // TODO handle error (e.g. out of gas)
    })
}
