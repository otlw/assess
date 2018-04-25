import { combineReducers } from 'redux'
import ethereum from './web3Reducer'
import assessments from './assessmentReducer'
import concepts from './conceptReducer'

export default combineReducers({
  ethereum,
  assessments,
  concepts
})
