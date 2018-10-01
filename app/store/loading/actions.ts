import {LoadingState} from './reducer'
export type Actions =
  ReturnType<typeof beginLoadingAssessments> |
  ReturnType<typeof endLoadingAssessments> |
  ReturnType<typeof beginLoadingConcepts> |
  ReturnType<typeof endLoadingConcepts> |
  ReturnType<typeof setMetamaskLoadingStage>

export function beginLoadingAssessments () {
  let type: "BEGIN_LOADING_ASSESSMENTS" = "BEGIN_LOADING_ASSESSMENTS"
  return {
    type
  }
}

export function endLoadingAssessments () {
  let type: "END_LOADING_ASSESSMENTS" = "END_LOADING_ASSESSMENTS"
  return {
    type
  }
}

export function beginLoadingConcepts () {
  let type:'BEGIN_LOADING_CONCEPTS' = 'BEGIN_LOADING_CONCEPTS'
  return {
    type
  }
}

export function endLoadingConcepts () {
  let type:'END_LOADING_CONCEPTS' = 'END_LOADING_CONCEPTS'
  return {
    type
  }
}

export function setMetamaskLoadingStage (stage:LoadingState['metamask']) {
  let type: 'SET_METAMASK_LOADING_STAGE' = 'SET_METAMASK_LOADING_STAGE'
  return {
    type,
    stage
  }
}
