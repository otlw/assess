import { Actions } from './actions'
//import { LoadingStage as LoadingConst } from '../../constants'

export type LoadingStage = null | 'Initial' | 'Loading' | 'Loaded' | 'Error' | 'MetaMask Loaded' | 'MetaMask Error'

export type LoadingState = {
  stage: LoadingStage
}

let initialState: LoadingState = {
  stage: 'Initial',
}

export function LoadingReducer (state = initialState, action: Actions): LoadingState {
  switch (action.type) {
  case 'SET_DATA_LOADING_STAGE' : {
    return {
      ...state,
      stage: action.stage
    }
  }
  default:
    return state
  }
}
