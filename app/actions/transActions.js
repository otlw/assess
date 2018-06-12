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
   @args: a list of args passed to the method
   @userAddress, @assessmentAddress and @saveData are used to mark the place where the transaction was triggered
   @react: an object describing the method to be called once the first transaction was confirmed
*/
export function sendAndReactToTransaction (dispatch, act, saveData, userAddress, assessmentAddress, react) {
  act.method(...act.args).send({from: userAddress, gas: 320000})
    .on('transactionHash', (hash) => {
      console.log("hash",hash)
      dispatch(saveTransaction(assessmentAddress, userAddress, saveData, hash))
        dispatch(react.method(...react.args))
    })
    .on('receipt', (receipt) => {
      console.log("receipt")
      console.log(receipt)
        dispatch(react.method(...react.args))
      dispatch(updateTransaction(
        receipt.transactionHash,
        receipt.status ? 'Tx published' : 'Tx failed'
      ))
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      console.log(confirmationNumber)
      console.log(receipt)
      if (react && confirmationNumber === 7 && receipt.status) {
        dispatch(updateTransaction(
          receipt.transactionHash,
          receipt.status ? 'Tx confirmed' : 'Tx failed'
        ))
        dispatch(react.method(...react.args))
      }
    })
    .on('error', (err) => {
      console.log('err', err)
      // TODO handle error (e.g. out of gas)
    })
}
