import { LoadingStage } from './reducer'
export type Actions =
  ReturnType<typeof setDataLoadingStage>

export function setDataLoadingStage (stage: LoadingStage) {
  let type: 'SET_DATA_LOADING_STAGE' = 'SET_DATA_LOADING_STAGE'
  return {
    type,
    stage
  }
}
