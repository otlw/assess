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
