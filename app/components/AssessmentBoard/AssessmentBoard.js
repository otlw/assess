import AssessmentList from './AssessmentList.js'
import AssessmentCard from './AssessmentCard'
import { Stage } from '../../constants.js'
import h from 'react-hyperscript'

export const AssessmentBoard = (props) => {
  let userAddress = props.userAddress
  let assessmentsAsList = Object.values(props.assessments)

  let assessmentLists = {
    Current: assessmentsAsList.filter(assessment => {
      if (props.userAddress === assessment.assessee) {
        return (assessment.stage < Stage.Done && !assessment.violation)
      }

      if (assessment.assessors && assessment.assessors.includes(props.userAddress)) {
        return assessment.stage > Stage.Called && assessment.stage < Stage.Done && !assessment.violation
      }
      return false
    }),
    Available: assessmentsAsList.filter(assessment => {
      return (assessment.userStage === Stage.Called &&
              assessment.stage === Stage.Called &&
              !assessment.violation &&
              (!assessment.hidden || (assessment.hidden && props.showHidden)))
    }),
    Past: assessmentsAsList.filter(assessment => {
      return (
        (assessment.assessee === props.userAddress ||
         (assessment.assessors && assessment.assessors.includes(props.userAddress))) &&
          (assessment.stage === Stage.Done || assessment.violation))
    })
  }

  return h('div', Object.keys(assessmentLists).map((key, index) => {
    return h(AssessmentList, {
      assessmentCard: AssessmentCard,
      assessments: assessmentLists[key],
      name: key,
      showHidden: props.showHidden,
      toggleHidden: props.toggleHidden,
      userAddress: userAddress,
      networkID: props.networkID
    })
  }))
}

export default AssessmentBoard
