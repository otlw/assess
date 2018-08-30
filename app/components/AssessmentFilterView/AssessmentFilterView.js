import AssessmentList from '../AssessmentList'
import AssessmentCard from '../AssessmentCard.js'
import { Stage } from '../../constants.js'
import h from 'react-hyperscript'

export const AssessmentFilterView = (props) => {
  let userAddress = props.userAddress
  let assessmentsAsList = Object.values(props.assessments)

  let assessmentLists = {
    Current: assessmentsAsList.filter(assessment => {
      if (props.userAddress === assessment.assessee) {
        return assessment.stage < Stage.Done
      }
      return assessment.stage > Stage.Called && assessment.stage < Stage.Done
    }),
    Available: assessmentsAsList.filter(assessment => {
      return (props.userAddress !== assessment.assessee &&
              assessment.stage === Stage.Called)
    }),
    Past: assessmentsAsList.filter(assessment => assessment.stage === Stage.Done)
  }

  // return view
  return h('div', Object.keys(assessmentLists).map((key, index) => {
    return h(AssessmentList, {
      assessmentCard: AssessmentCard,
      assessments: assessmentLists[key],
      name: key,
      userAddress: userAddress,
      networkID: props.networkID
    })
  }))
}

export default AssessmentFilterView
