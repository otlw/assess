import extend from 'xtend'
import {Actions} from './actions'

export type Assessment = {
    address: string
    cost: number,
    size: number,
    assessee: string,
    assessors: string[]
    stage: 0 | 1 | 2 | 3 | 4
    finalScore: number,
    data: {
      [prop: string]: string
    },
    payout: number,
    violation: boolean,
    refunded: boolean
    hidden: boolean,
}
export type TState = {
  [prop:string]: Assessment
}

let initialState:TState = {
}

/*
  further assessments are stored like this:

address : {
  cost: 0
  size: 5,
  assessee: 0x...,
  stage: [0,4]
  finalScore: [-127, 127],
  userStage: 0,
  data: {
     address: dataString,
     ...
  },
  payout: 20,
  violation: false,
  refunded: false
  hidden: false
}
 */
function assessments (state = initialState, action:Actions):TState {
  switch (action.type) {
    case "RECEIVE_ASSESSMENT": {
      let assessmentAddress = action.assessment.address
      return extend(state, {[assessmentAddress]: extend(state[assessmentAddress], action.assessment)})
    }
    case "REMOVE_ASSESSMENT": {
      let newStage = {...state}
      delete newStage[action.assessmentAddress]
      return newStage
    }
    case "RECEIVE_ASSESSOR": {
      let assessmentAddress = action.assessmentAddress
      let assessment = state[assessmentAddress] || {assessors: []}
      let newAssessors = assessment.assessors.slice(0)
      newAssessors.push(action.assessor)
      return {
        ...state,
        [assessmentAddress]: extend(assessment, {assessors: newAssessors})
      }
    }
    case "UPDATE_ASSESSMENT_VARIABLE": {
      return {
        ...state,
        [action.assessmentAddress]: extend(state[action.assessmentAddress], {[action.name]: action.value})
      }
    }

    case "SET_ASSESSMENT_AS_INVALID": {
      return {
        ...state,
        [action.assessmentAddress]: extend(state[action.assessmentAddress], {'invalid': true})
      }
    }
    case "RECEIVE_ALL_ASSESSMENTS": {
      return extend(state, action.assessments)
    }
    default:
      return state
  }
}

export default assessments
