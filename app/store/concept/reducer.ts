import {Actions} from './actions'
import extend from 'xtend'

export type ConceptsState = {
  [prop: string]: {
    description: string
    learnMore: string
    name: String
    userIsMember: boolean
    userIsActiveAssessor: boolean
}
}
let initialState:ConceptsState = {}

export function ConceptsReducer (state = initialState, action:Actions):ConceptsState {
  switch (action.type) {
    case "RECEIVE_CONCEPTS":
      return action.concepts
    case "UPDATE_USER_STATUS":
      return {
        ...state,
        [action.conceptAddress]: extend(state[action.conceptAddress], {[action.name]: action.value})
      }
    default:
      return state
  }
}
