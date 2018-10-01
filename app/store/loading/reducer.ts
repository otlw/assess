import {Actions} from './actions'
import { LoadingStage } from '../../constants'

type Loading = null | "Loading" | "Loaded" | "Error"
export type LoadingState = {
  assessments: number,
  concepts: number,
  metamask: Loading,
  contracts: Loading
}
let initialState:LoadingState = {
  assessments: LoadingStage.None,
  concepts: LoadingStage.None,
  metamask: null,
  contracts: null
}

export function LoadingReducer (state = initialState, action:Actions):LoadingState {
  switch (action.type) {
    case "BEGIN_LOADING_ASSESSMENTS": {
      return {
        ...state,
        assessments: LoadingStage.Loading
      }
    }
    case "END_LOADING_ASSESSMENTS": {
      return {
        ...state,
        assessments: LoadingStage.Done
      }
    }
    case "BEGIN_LOADING_CONCEPTS": {
      return {
        ...state,
        concepts: LoadingStage.Loading
      }
    }
    case "END_LOADING_CONCEPTS": {
      return {
        ...state,
        concepts: LoadingStage.Done
      }
    }
    case "SET_METAMASK_LOADING_STAGE": {
      return {
        ...state,
        metamask: action.stage
      }
    }
    default:
      return state
  }
}
