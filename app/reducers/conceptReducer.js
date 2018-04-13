import {
  RECEIVE_CONCEPTS,
} from '../actions/conceptActions'

let initialState = []

function concepts (state = initialState, action) {
  console.log('reducer got:', action.type, 'with payload: ', action)
  switch (action.type) {
  case RECEIVE_CONCEPTS: {
    let newState = action.concepts
    return newState
  }
  default:
    return state
  }
}

export default concepts
