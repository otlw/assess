import { Actions } from './actions'
import { LoadingStage as LoadingConst } from '../../constants'

export type LoadingStage = null | 'Loading' | 'Loaded' | 'Error'

export type LoadingState = {
  assessments: number
  concepts: number
  metamask: LoadingStage
  history: LoadingStage
}

let initialState: LoadingState = {
  assessments: LoadingConst.None,
  concepts: LoadingConst.None,
  metamask: null,
  history: null
}

export function LoadingReducer (state = initialState, action: Actions): LoadingState {
  switch (action.type) {
  case 'BEGIN_LOADING_ASSESSMENTS':
    return {
      ...state,
      assessments: LoadingConst.Loading
    }
  case 'END_LOADING_ASSESSMENTS': {
    return {
      ...state,
      assessments: LoadingConst.Done
    }
  }
  case 'BEGIN_LOADING_CONCEPTS':
    return {
      ...state,
      concepts: LoadingConst.Loading
    }
  case 'END_LOADING_CONCEPTS': {
    return {
      ...state,
      concepts: LoadingConst.Done
    }
  }
  case 'SET_METAMASK_LOADING_STAGE' : {
    return {
      ...state,
      metamask: action.stage
    }
  }
  case 'SET_HISTORY_LOADING_STAGE' : {
    return {
      ...state,
      history: action.stage
    }
  }
  default:
    return state
  }
}
