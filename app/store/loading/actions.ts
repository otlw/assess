import { LoadingStage } from './reducer'
export type Actions =
  ReturnType<typeof beginLoadingAssessments> |
  ReturnType<typeof endLoadingAssessments> |
  ReturnType<typeof beginLoadingConcepts> |
  ReturnType<typeof endLoadingConcepts> |
  ReturnType<typeof setMetamaskLoadingStage> |
  ReturnType<typeof setHistoryLoadingStage>

export function beginLoadingAssessments () {
  let type: "BEGIN_LOADING_ASSESSMENTS" = 'BEGIN_LOADING_ASSESSMENTS'
  return {
    type
  }
}

export function endLoadingAssessments () {
  let type: "END_LOADING_ASSESSMENTS" = 'END_LOADING_ASSESSMENTS'
  return {
    type
  }
}

export function beginLoadingConcepts () {
  let type: 'BEGIN_LOADING_CONCEPTS' = 'BEGIN_LOADING_CONCEPTS'
  return {
    type
  }
}

export function endLoadingConcepts () {
  let type: 'END_LOADING_CONCEPTS' = 'END_LOADING_CONCEPTS'
  return {
    type
  }
}

export function setMetamaskLoadingStage (stage: LoadingStage) {
  let type: 'SET_METAMASK_LOADING_STAGE' = 'SET_METAMASK_LOADING_STAGE'
  return {
    type,
    stage
  }
}

export function setHistoryLoadingStage (stage: LoadingStage) {
  let type: 'SET_HISTORY_LOADING_STAGE' = 'SET_HISTORY_LOADING_STAGE'
  return {
    type,
    stage
  }
}
