import AssessmentList from '../AssessmentList'
import { Stage } from '../../constants.js'
import h from 'react-hyperscript'

export const AssessmentFilterView = (props) => {
  let userAddress = props.userAddress
  let assessmentAsList = Object.values(props.assessments)

  let assessmentLists = {
    Current: assessmentAsList.filter(assessment => {
      if (props.userAddress === assessment.assessee) {
        return assessment.stage < Stage.Done
      }
      return assessment.stage > Stage.Called && assessment.stage < Stage.Done
    }),
    Available: assessmentAsList.filter(assessment => {
      return (props.userAddress !== assessment.assessee &&
              assessment.stage === Stage.Called)
    }),
    Completed: assessmentAsList.filter(assessment => assessment.stage === Stage.Done)
  }

  // return view
  return h('div', Object.keys(assessmentLists).map((key, index) => {
    return h(AssessmentList, {
      assessments: assessmentLists[key],
      name: key,
      userAddress: userAddress,
      networkID: props.networkID
    })
  }))
}

export default AssessmentFilterView
