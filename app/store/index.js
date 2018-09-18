import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import ethereum from './web3/reducer'
import assessments from './assessment/reducer'
import concepts from './concept/reducer'
import transactions from './transaction/reducer'
import navigation from './navigation/reducer'
import loading from './loading/reducer'

export default combineReducers({
  form: reduxFormReducer,
  ethereum,
  assessments,
  concepts,
  transactions,
  navigation,
  loading
})
