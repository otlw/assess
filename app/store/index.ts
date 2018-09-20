import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import ethereum from './web3/reducer'
import {AssessmentsReducer, AssessmentsState } from './assessment/reducer'
import {ConceptsReducer, ConceptsState }from './concept/reducer'
import transactions from './transaction/reducer'
import {NavigationReducer, NavigationState} from './navigation/reducer'
import loading from './loading/reducer'

export type State = {
  form: any,
  ethereum: any,
  assessments: AssessmentsState,
  concept: ConceptsState,
  navigation: NavigationState
}
export default combineReducers({
  form: reduxFormReducer,
  ethereum,
  assessments: AssessmentsReducer,
  concepts: ConceptsReducer,
  transactions,
  navigation: NavigationReducer,
  loading
})
