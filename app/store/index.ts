import { combineReducers } from 'redux'
import { EthereumReducer, EthereumState } from './web3/reducer'
import { AssessmentsReducer, AssessmentsState } from './assessment/reducer'
import { ConceptsReducer, ConceptsState }from './concept/reducer'
import { TransactionsReducer, TransactionsState } from './transaction/reducer'
import { NavigationReducer, NavigationState } from './navigation/reducer'
import { LoadingReducer, LoadingState } from './loading/reducer'

export type State = {
  ethereum: EthereumState,
  assessments: AssessmentsState,
  concepts: ConceptsState,
  transactions: TransactionsState,
  navigation: NavigationState,
  loading: LoadingState
}

export default combineReducers({
  ethereum: EthereumReducer,
  assessments: AssessmentsReducer,
  concepts: ConceptsReducer,
  transactions: TransactionsReducer,
  navigation: NavigationReducer,
  loading: LoadingReducer
})
