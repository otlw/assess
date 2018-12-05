import extend from 'xtend'
import { Actions } from './actions'
export type ConceptsState = {
  [prop: string]: {
    description: string
    learnMore: string
    name: String
}
}
let initialState = {}

export function ConceptsReducer (state = initialState, action: Actions): ConceptsState {
  switch (action.type) {
  case 'RECEIVE_CONCEPTS':
    return extend(state, action.concepts)
  default:
    return state
  }
}
