import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import ethereum from './web3Reducer'
import assessments from './assessmentReducer'
import concepts from './conceptReducer'
import transactions from './transactionReducer'

export default combineReducers({
  form: reduxFormReducer,
  ethereum,
  assessments,
  concepts,
  transactions
})
