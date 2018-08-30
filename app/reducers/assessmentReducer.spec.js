// const assessments = require('./assessmentReducer')
// const extend = require('xtend')
// const {
//   RECEIVE_ASSESSMENT,
//   RECEIVE_ASSESSOR,
//   REMOVE_ASSESSMENT,
//   SET_ASSESSMENT_AS_INVALID,
//   UPDATE_ASSESSMENT_VARIABLE
// } = require('../actions/assessmentActions')
import assessments from './assessmentReducer.js'
import extend from 'xtend'
import {
  RECEIVE_ASSESSMENT,
  RECEIVE_ASSESSOR,
  REMOVE_ASSESSMENT,
  SET_ASSESSMENT_AS_INVALID,
  UPDATE_ASSESSMENT_VARIABLE
} from '../actions/assessmentActions'

// const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT'
// const REMOVE_ASSESSMENT = 'REMOVE_ASSESSMENT'
// const RECEIVE_ASSESSOR = 'RECEIVE_ASSESSOR'
// const BEGIN_LOADING_ASSESSMENTS = 'BEGIN_LOADING_ASSESSMENTS'
// const END_LOADING_ASSESSMENTS = 'END_LOADING_ASSESSMENTS'
// const SET_ASSESSMENT_AS_INVALID = 'SET_ASSESSMENT_AS_INVALID'
// const UPDATE_ASSESSMENT_VARIABLE = 'UPDATE_ASSESSMENT_VARIABLE'


// function assessments (state = initialState, action) {
//   console.log('assessmentReducer')
//   console.log('STATE: ', state)
//   console.log('ACTION: ', action)
//   switch (action.type) {
//     case RECEIVE_ASSESSMENT: {
//       let address = action.assessment.address
//       return extend(state, {[address]: extend(state[address], action.assessment)})
//     }
//     case REMOVE_ASSESSMENT: {
//       let newStage = {...state}
//       delete newStage[action.address]
//       return newStage
//     }
//     case RECEIVE_ASSESSOR: {
//       let address = action.address
//       let assessment = state[address] || {assessors: []}
//       let newAssessors = assessment.assessors.slice(0)
//       newAssessors.push(action.assessor)
//       return {
//         ...state,
//         [address]: extend(assessment, {assessors: newAssessors})
//       }
//     }
//     case UPDATE_ASSESSMENT_VARIABLE: {
//       return {
//         ...state,
//         [action.address]: extend(state[action.address], {[action.name]: action.value})
//       }
//     }
//     case SET_ASSESSMENT_AS_INVALID: {
//       return {
//         ...state,
//         [action.address]: {'invalid': true}
//       }
//     }
//     default:
//       return state
//   }
// }

test(RECEIVE_ASSESSMENT, () => {
  console.log('---Inside RECEIVE_ASSESSMENT Test---')
  const initialState = {}
  const address = "0x9f0D91aA239c2DE2222EA5593b37093ea367F49d"
  const assessee = "0x749da07afBD691d0D5932f42F98358A150952c9e"
  const assessors = ["0xf2a2E600Eb309A5d8A17C18756F65608bD5ce5Db"]
  const assessment = {address, assessee, assessors}
  const action = {
    type: RECEIVE_ASSESSMENT,
    assessment
  }
  // const result = assessments(initialState, action)
  // console.log('RESULT: ', result)
  // console.log('COPY????? :', {[address]: assessment})
  // expect(result).toEqual({
  //   [address]: assessment
  // })
})

// import article from '../article'

// export default (state = {}, action) => {
//   switch (action.type) {
//     case 'ARTICLE_PAGE_LOADED': {
//       return {
//         ...state,
//         article: action.payload[0].article,
//         comments: action.payload[1].comments,
//       }
//     }
//     case 'ARTICLE_PAGE_UNLOADED': {
//       return {}
//     }
//     case 'ADD_COMMENT': {
//       return {
//         ...state,
//         commentErrors: action.error ? action.payload.errors : null,
//         comments: action.error ?
//           null :
//           (state.comments || []).concat([action.payload.comment]),
//       }
//     }
//     case 'DELETE_COMMENT': {
//       const commentId = action.commentId
//       return {
//         ...state,
//         comments: state.comments.filter(comment => comment.id !== commentId),
//       }
//     }
//     default: {
//       return state
//     }
//   }
// }


// test('ARTICLE_PAGE_LOADED', () => {
//   const initialState = {}
//   const articleData = {title: 'Mighty Mouse'}
//   const comments = [1, 2, 3]
//   const action = {
//     type: 'ARTICLE_PAGE_LOADED',
//     payload: [{article: articleData}, {comments}],
//   }
//   const result = article(initialState, action)
//   expect(result).toEqual({
//     article: articleData,
//     comments,
//   })
// })