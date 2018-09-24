export type Actions =
  ReturnType<typeof beginLoadingAssessments> |
  ReturnType<typeof endLoadingAssessments>

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
