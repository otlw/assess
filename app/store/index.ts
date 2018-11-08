import { combineReducers } from 'redux'
import { EthereumReducer, EthereumState } from './web3/reducer'
import { AssessmentsReducer, AssessmentsState } from './assessment/reducer'
import { ConceptsReducer, ConceptsState } from './concept/reducer'
import { TransactionsReducer, TransactionsState } from './transaction/reducer'
import { NavigationReducer, NavigationState } from './navigation/reducer'
import { LoadingReducer, LoadingState } from './loading/reducer'

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

export type State = {
  ethereum: EthereumState
  assessments: AssessmentsState
  concepts: ConceptsState
  transactions: TransactionsState
  navigation: NavigationState
  loading: LoadingState
}

type PersistConfig = {
  key: string
  storage: any
  whitelist: string[]
}

// we need to declare nested persisted states here
const EthereumPersistConfig: PersistConfig = {
  key: 'ethereum',
  storage: storage,
  whitelist: ['lastUpdatedAt', 'deployedConceptRegistryAt', 'deployedFathomTokenAt']
}

const NavigationPersistConfig: PersistConfig = {
  key: 'navigation',
  storage: storage,
  whitelist: ['visits']
}

export default combineReducers({
  ethereum: persistReducer(EthereumPersistConfig, EthereumReducer),
  assessments: AssessmentsReducer,
  concepts: ConceptsReducer,
  transactions: TransactionsReducer,
  navigation: persistReducer(NavigationPersistConfig, NavigationReducer),
  loading: LoadingReducer
})
