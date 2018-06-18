import {
  SAVE_TRANSACTION,
  UPDATE_TRANSACTION,
  REMOVE_TRANSACTION
} from '../actions/transActions'

import extend from 'xtend'

let initialState = {}

// state will look like this:
// state = {
//       txHash: {
//         sender: ..
//         assessment: 0x...
//         stage: 1-4 // to only display the Txs relevant to the current stage
//         status: pending/success/failure
//         timestamp: Date.now() // to order them chronolically
//       }
//     }
//   }
// }

function transactions (state = initialState, action) {
  switch (action.type) {
    case SAVE_TRANSACTION:
      return {
        ...state,
        [action.txHash]: {
          sender: action.sender,
          txHash: action.txHash,
          address: action.address,
          data: action.data,
          status: 'Tx published',
          time: Date.now()
        }
      }
    case UPDATE_TRANSACTION:
      return {
        ...state,
        [action.txHash]: extend(state[action.txHash], {status: action.status})
      }
    case REMOVE_TRANSACTION: {
      let newState = {...state}
      delete newState[action.txHash]
      return newState
    }
    default:
      return state
  }
}

export default transactions
