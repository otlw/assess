import {Actions} from './actions'
export type TState = {
  [prop: string]: {
    description: string
    learnMore: string
    name: String
}
}
let initialState = {}

function concepts (state = initialState, action:Actions):TState {
  switch (action.type) {
    case "RECEIVE_CONCEPTS":
      return action.concepts
    default:
      return state
  }
}

export default concepts
