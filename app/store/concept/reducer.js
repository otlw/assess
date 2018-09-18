import { RECEIVE_CONCEPTS } from '../actions'
import { RECEIVE_PERSISTED_STATE } from '../web3/actions'

let initialState = {}

/*
  further concepts are stored like this:

[
  conceptAddress : {
    description:string,
    learnMore:string,
    name:string
  },
  ...
]

if the data is correctly stored on ipfs and:

[
  conceptAddress : {
    description:sameString,
    name:sameString
  },
  ...
]

if the string is not an ipfs hash

 */

function concepts (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CONCEPTS:
      return action.concepts
    case RECEIVE_PERSISTED_STATE:
      return action.persistedState.concepts
    default:
      return state
  }
}

export default concepts
