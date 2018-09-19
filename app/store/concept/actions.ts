import {TState} from './reducer'

export type Actions = ReturnType<typeof receiveConcepts>
export function receiveConcepts (concepts:TState) {
  let type:"RECEIVE_CONCEPTS" = 'RECEIVE_CONCEPTS'
  return {
    type,
    concepts
  }
}

