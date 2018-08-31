import assessments from './assessmentReducer.js'
import extend from 'xtend'
import {
  RECEIVE_ASSESSMENT,
  RECEIVE_ASSESSOR,
  REMOVE_ASSESSMENT,
  SET_ASSESSMENT_AS_INVALID,
  UPDATE_ASSESSMENT_VARIABLE
} from '../actions/assessmentActions'

// RECEIVE_ASSESSMENT
describe('assessmentReducer', () => {
  const initialState = {}
  const priorState = {"0x123": {"address": "0x123", "assessee": "0x456", "assessors": ["0x789"]}}

  test('should add a new assessment to initial state', () => {
    const address = "0x9f0D"
    const assessee = "0x749"
    const assessors = ["0xf2a"]
    const assessment = {address, assessee, assessors}
    const action = {
      type: RECEIVE_ASSESSMENT,
      assessment
    }
    const result = assessments(initialState, action)
    expect(result).toEqual({
      [address]: assessment
    })
  })

  test('should add a new assessment to prior assessments', () => {
    const address = "0x9f0D"
    const assessee = "0x749"
    const assessors = ["0xf2a"]
    const assessment = {address, assessee, assessors}
    const action = {
      type: RECEIVE_ASSESSMENT,
      assessment
    }
    const result = assessments(priorState, action)
    expect(result).toEqual({
       ...priorState,
       [address]: assessment
    })
  })
  
})

// RECEIVE_ASSESSOR,

// REMOVE_ASSESSMENT,

// SET_ASSESSMENT_AS_INVALID,

// UPDATE_ASSESSMENT_VARIABLE
