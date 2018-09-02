/* eslint-env jest */

// import configureMockStore from 'redux-mock-store'
// import thunk from 'redux-thunk'
import * as actions from './assessmentActions'

// const middlewares = [thunk]
// const mockStore = configureMockStore(middlewares)

describe('assessmentActions', () => {
  // BASICS
  describe('basic action creators', () => {
    // receiveAssessor
    test('should create an action to receive an assessor', () => {
      const address = '0x9f0D'
      const assessor = '0xf2a'
      const expectedAction = actions.receiveAssessor(address, assessor)
      expect(expectedAction).toEqual({
        type: actions.RECEIVE_ASSESSOR,
        address,
        assessor
      })
    })

    // receiveAssessment
    test('should create an action to receive an assessment', () => {
      const assessment = { 'address': '0x123', 'assessee': '0x456', 'assessors': ['0x789'] }
      const expectedAction = actions.receiveAssessment(assessment)
      expect(expectedAction).toEqual({
        type: actions.RECEIVE_ASSESSMENT,
        assessment
      })
    })

    // updateAssessmentVariable
    test('should create an action to update an assessment variable', () => {
      const address = '0x9f0D'
      const name = 'stage'
      const value = [0, 4]
      const expectedAction = actions.updateAssessmentVariable(address, name, value)
      expect(expectedAction).toEqual({
        type: actions.UPDATE_ASSESSMENT_VARIABLE,
        address,
        name,
        value
      })
    })

    // removeAssessment // UNUSED AS YET
    test('should create an action to remove an assessment', () => {
      const address = '0x123'
      const expectedAction = actions.removeAssessment(address)
      expect(expectedAction).toEqual({
        type: actions.REMOVE_ASSESSMENT,
        address
      })
    })

    // beginLoadingAssessments
    test('should create an action to begin loading assessments', () => {
      const expectedAction = actions.beginLoadingAssessments()
      expect(expectedAction).toEqual({
        type: actions.BEGIN_LOADING_ASSESSMENTS
      })
    })

    // endLoadingAssessments
    test('should create an action to end loading assessments', () => {
      const expectedAction = actions.endLoadingAssessments()
      expect(expectedAction).toEqual({
        type: actions.END_LOADING_ASSESSMENTS
      })
    })

    // setAssessmentAsInvalid
    test('should create an action to set assessment as invalid', () => {
      const address = '0x123'
      const expectedAction = actions.setAssessmentAsInvalid(address)
      expect(expectedAction).toEqual({
        type: actions.SET_ASSESSMENT_AS_INVALID,
        address
      })
    })
  })

  // asyncs
  // describe('async action creators', () => {
  //  test('should dispatch actions')
  // })
})

// confirm assessor // l39
// should dispatch actions --> test that those actions are being dispatched
// redux-mock-store

/* IMPORTS */
// import { getInstance, convertFromOnChainScoreToUIScore } from '../utils.js'
// import { sendAndReactToTransaction } from './transActions.js'
// import { receiveVariable, fetchUserBalance } from './web3Actions.js'
// import { Stage, LoadingStage, NotificationTopic } from '../constants.js'

// const ethereumjsABI = require('ethereumjs-abi')
// const ipfsAPI = require('ipfs-api')

/* HELPERS */
// const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
// hashScoreAndSalt
// => Import: ethereumjsABI

/* ASYNC ACTION CREATORS */
// confirmAssessor
// => Import: getInstance.assessment
// => Import: sendAndReactToTransaction
// ==> Async: fetchUserStage

// commit
// => Import: getInstance.assessment
// => Import: sendAndReactToTransaction
// ==> Async: fetchUserStage

// reveal
// => Import: getInstance.assessment
// => Import: sendAndReactToTransaction
// ==> Async: fetchUserStage

// storeDataOnAssessment
// => Import: getInstance.assessment
// => Import: sendAndReactToTransaction
// ==> Async: fetchUserStage

// fetchLatestAssessments
// => Basic: beginLoadingAssessments
// => Import: getInstance.fathomToken
// => Import: receiveVariable
// => Async: fetchAssessmentData
// => Basic: endLoadingAssessments

// validateAndFetchAssessmentData
// => Import: getInstance.assessment
// => Import: getInstance.conceptRegistry
// => Import: getInstance.concept
// => Async: fetchAssessmentData
// => Basic: setAssessmentAsInvalid

// fetchAssessmentData
// => Import: getInstance.assessment
// => Import: getInstance.concept
// => Import: await ipfs.get
// => Import: getInstance.fathomToken
// => Import: convertFromOnChainScoreToUIScore
// => Basic: receiveAssessment

// fetchPayout
// => Import: getInstance.fathomToken
// => Basic: updateAssessmentVariable

// fetchUserStage
// => Import: getInstance.assessment
// => Basic: updateAssessmentVariable

// fetchFinalScore
// => Import: getInstance.assessment
// => Import: convertFromOnChainScoreToUIScore
// => Basic: updateAssessmentVariable

// fetchStoredData
// => Import: getInstance.assessment
// => Basic: updateAssessmentVariable

// processEvent
// => Import: NotificationTopic
// ==> Import: fetchUserBalance
// ==> Async: fetchAssessmentData
// ==> Async: fetchUserStage
// => Basic: receiveAssessor
// => Basic: updateAssessmentVariable
// ==> Async: fetchPayout
// ==> Async: fetchFinalScore

/* BASIC ACTION CREATORS */

// receiveAssessor (done)

// receiveAssessment (done)

// updateAssessmentVariable (done)

// removeAssessment // UNUSED AS YET (done)

// beginLoadingAssessments (done)

// endLoadingAssessments (done)

// setAssessmentAsInvalid (done)
