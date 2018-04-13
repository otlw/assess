import { combineReducers } from 'redux'
import ethereum from './web3Reducer'
import assessments from './assessmentReducer'

export default combineReducers({
  ethereum: ethereum,
  assessments: assessments
})
