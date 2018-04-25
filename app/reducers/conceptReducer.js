import {
  RECEIVE_CONCEPTS
} from '../actions/conceptActions'

let initialState = {}

function concepts (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CONCEPTS:
      return action.concepts
    default:
      return state
  }
}

export default concepts
