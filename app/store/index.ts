import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import { EthereumReducer, EthereumState } from './web3/reducer'
import { AssessmentsReducer, AssessmentsState } from './assessment/reducer'
import {ConceptsReducer, ConceptsState }from './concept/reducer'
import { TransactionsReducer, TransactionsState } from './transaction/reducer'
import { NavigationReducer, NavigationState } from './navigation/reducer'
import loading from './loading/reducer'

export type State = {
  form: any,
  ethereum: EthereumState,
  assessments: AssessmentsState,
  concepts: ConceptsState,
  transactions: TransactionsState,
  navigation: NavigationState,
}
export default combineReducers({
  form: reduxFormReducer,
  ethereum: EthereumReducer,
  assessments: AssessmentsReducer,
  concepts: ConceptsReducer,
  transactions: TransactionsReducer,
  navigation: NavigationReducer,
  loading
})
