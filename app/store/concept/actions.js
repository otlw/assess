export const RECEIVE_CONCEPTS = 'RECEIVE_CONCEPTS'
export const BEGIN_LOADING_CONCEPTS = 'BEGIN_LOADING_CONCEPTS'
export const END_LOADING_CONCEPTS = 'END_LOADING_CONCEPTS'

export function receiveConcepts (concepts) {
  return {
    type: RECEIVE_CONCEPTS,
    concepts
  }
}

