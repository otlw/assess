import extend from 'xtend'

import { Actions } from './actions'

export type Transaction = {
  sender: string
  txHash: string
  address: string
  purpose: 'stake' | 'commit' | 'reveal' | 'refund' | 'setMeetingPoint' | 'meetingPointChange' | 'makeAssessment'
  status: 'published' | 'confirmed' | 'failed'
  time: number
}

export type TransactionsState = {
  [prop: string]: Transaction
}

let initialState:TransactionsState = {}

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

export function TransactionsReducer (state = initialState, action:Actions):TransactionsState {
  switch (action.type) {
    case 'SAVE_TRANSACTION':
      return {
        ...state,
        [action.txHash]: {
          txHash: action.txHash,
          address: action.address,
          sender: action.sender,
          purpose: action.purpose,
          status: 'published',
          time: Date.now()
        }
      }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        [action.txHash]: extend(state[action.txHash], {
          txHash: action.txHash,
          address: action.address,
          sender: action.sender,
          purpose: action.purpose,
          status: action.status,
          time: Date.now()
        })
      }
    case 'REMOVE_TRANSACTION': {
      let newState = {...state}
      delete newState[action.txHash]
      return newState
    }
    default:
      return state
  }
}
