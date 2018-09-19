import {ConceptsState} from './reducer'

export type Actions = ReturnType<typeof receiveConcepts>
export function receiveConcepts (concepts:ConceptsState) {
  let type:"RECEIVE_CONCEPTS" = 'RECEIVE_CONCEPTS'
  return {
    type,
    concepts
  }
}

