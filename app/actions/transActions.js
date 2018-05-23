export const SAVE_TRANSACTION = 'SAVE_TRANSACTION'
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'
export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION'

export function saveTransaction (address, sender, stage, txHash) {
  return {
    type: SAVE_TRANSACTION,
    address,
    sender,
    stage,
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
