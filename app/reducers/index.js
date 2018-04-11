import { combineReducers } from 'redux'
import connect from './web3Reducer'
import assessments from './assessmentReducer'

export default combineReducers({
  connect: connect,
  assessments: assessments
})
