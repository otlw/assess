import {ConceptsState} from './reducer'

export type Actions = ReturnType<typeof receiveConcepts> | ReturnType<typeof updateUserStatus>

export function receiveConcepts (concepts:ConceptsState) {
  let type:"RECEIVE_CONCEPTS" = 'RECEIVE_CONCEPTS'
  return {
    type,
    concepts
  }
}

export function updateUserStatus (conceptAddress:string, name:string, value:any) {
  let type:"UPDATE_USER_STATUS" = "UPDATE_USER_STATUS"
  return {
    type,
    conceptAddress,
    name,
    value
  }
}
