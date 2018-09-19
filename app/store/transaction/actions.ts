import { Transaction } from './reducer'

export type Action =
  ReturnType<typeof saveTransaction> |
  ReturnType<typeof updateTransaction> |
  ReturnType<typeof removeTransaction>

// note: the data parameter can be used to describes the place where the transaction should be displayed.
// For example the below the assessor-buttons, the data field is expected to be the
// stage of the assessment during which this transaction should be displayed.

export function saveTransaction (address: Transaction['address'], sender: Transaction['sender'], data: Transaction['data'], txHash: Transaction['txHash']) {
  let type: 'SAVE_TRANSACTION' = 'SAVE_TRANSACTION'
  return {
    type,
    address,
    sender,
    data,
    txHash
  }
}

export function updateTransaction (txHash: Transaction['txHash'], status: Transaction['status']) {
  let type: 'UPDATE_TRANSACTION' = 'UPDATE_TRANSACTION'
  return {
    type,
    txHash,
    status
  }
}

export function removeTransaction (txHash: Transaction['txHash']) {
  let type: 'REMOVE_TRANSACTION' = 'REMOVE_TRANSACTION'
  return {
    type,
    txHash
  }
}
