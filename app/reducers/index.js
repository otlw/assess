import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import ethereum from './web3Reducer'
import assessments from './assessmentReducer'
import concepts from './conceptReducer'
import transactions from './transactionReducer'
import navigation from './navigationReducer'
import loading from './loadingReducer'

export default combineReducers({
  form: reduxFormReducer,
  ethereum,
  assessments,
  concepts,
  transactions,
  navigation,
  loading
})
