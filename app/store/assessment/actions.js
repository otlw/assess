export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
export const REMOVE_ASSESSMENT = 'REMOVE_ASSESSMENT'
export const RECEIVE_ASSESSOR = 'RECEIVE_ASSESSOR'
export const BEGIN_LOADING_ASSESSMENTS = 'BEGIN_LOADING_ASSESSMENTS'
export const END_LOADING_ASSESSMENTS = 'END_LOADING_ASSESSMENTS'
export const SET_ASSESSMENT_AS_INVALID = 'SET_ASSESSMENT_AS_INVALID'
export const UPDATE_ASSESSMENT_VARIABLE = 'UPDATE_ASSESSMENT_VARIABLE'


export function setCardVisibility (assessmentAddress, hiddenStatus) {
  return async (dispatch, getState) => {
    dispatch(updateAssessmentVariable(assessmentAddress, 'hidden', hiddenStatus))
  }
}

export function receiveAssessor (assessmentAddress, assessor) {
  return {
    type: RECEIVE_ASSESSOR,
    assessmentAddress,
    assessor
  }
}

export function receiveAssessment (assessment) {
  return {
    type: RECEIVE_ASSESSMENT,
    assessment
  }
}

export function updateAssessmentVariable (assessmentAddress, name, value) {
  return {
    type: UPDATE_ASSESSMENT_VARIABLE,
    assessmentAddress,
    name,
    value
  }
}

export function removeAssessment (assessmentAddress) {
  return {
    type: REMOVE_ASSESSMENT,
    assessmentAddress
  }
}

export function beginLoadingAssessments () {
  return {
    type: BEGIN_LOADING_ASSESSMENTS
  }
}

export function endLoadingAssessments () {
  return {
    type: END_LOADING_ASSESSMENTS
  }
}

export function setAssessmentAsInvalid (assessmentAddress) {
  return {
    type: SET_ASSESSMENT_AS_INVALID,
    assessmentAddress
  }
}
