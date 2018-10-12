import {Assessment, AssessmentsState} from './reducer'
export type Actions =
  ReturnType<typeof receiveAssessor> |
  ReturnType<typeof receiveAssessment> |
  ReturnType<typeof receiveAllAssessments> |
  ReturnType<typeof updateAssessmentVariable> |
  ReturnType<typeof removeAssessment> |
  ReturnType<typeof setAssessmentAsInvalid> |
  ReturnType<typeof setCardVisibility>

export function setCardVisibility (assessmentAddress:string, hidden:boolean) {
  let type:'SET_CARD_VISIBILITY' = 'SET_CARD_VISIBILITY'
  return {
    type,
    assessmentAddress,
    hidden
  }
}

export function receiveAssessor (assessmentAddress:string, assessor:string) {
  let type:'RECEIVE_ASSESSOR' = 'RECEIVE_ASSESSOR'
  return {
    type,
    assessmentAddress,
    assessor
  }
}

export function receiveAssessment (assessment:Assessment) {
  let type:'RECEIVE_ASSESSMENT' = 'RECEIVE_ASSESSMENT'
  return {
    type,
    assessment
  }
}

export function receiveAllAssessments (assessments: AssessmentsState) {
  let type: "RECEIVE_ALL_ASSESSMENTS" = "RECEIVE_ALL_ASSESSMENTS"
  return {
    type,
    assessments
  }
}

export function updateAssessmentVariable (assessmentAddress:string, name:string, value:any) {
  let type:'UPDATE_ASSESSMENT_VARIABLE' = 'UPDATE_ASSESSMENT_VARIABLE'
  return {
    type,
    assessmentAddress,
    name,
    value
  }
}

export function removeAssessment (assessmentAddress:string) {
  let type:'REMOVE_ASSESSMENT' = 'REMOVE_ASSESSMENT'
  return {
    type,
    assessmentAddress
  }
}

export function setAssessmentAsInvalid (assessmentAddress:string) {
  let type: "SET_ASSESSMENT_AS_INVALID" = "SET_ASSESSMENT_AS_INVALID"
  return {
    type,
    assessmentAddress
  }
}
