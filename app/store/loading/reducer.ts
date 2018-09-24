import {Actions} from './actions'
import { LoadingStage } from '../../constants'

type LoadingState = {
  assessments: number,
  concepts: number,
}
let initialState:LoadingState = {
  assessments: LoadingStage.None,
  concepts: LoadingStage.None,
}

function loading (state = initialState, action:Actions):LoadingState {
  switch (action.type) {
    case "BEGIN_LOADING_ASSESSMENTS":
      return {
        ...state,
        assessments: LoadingStage.Loading
      }
    case "END_LOADING_ASSESSMENTS": {
      return {
        ...state,
        assessments: LoadingStage.Done
      }
    }
    default:
      return state
  }
}

export default loading
