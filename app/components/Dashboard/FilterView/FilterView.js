import AssessmentList from './AssessmentList'

import h from 'react-hyperscript'

const Stage = {
  None: 0,
  Called: 1,
  Confirmed: 2,
  Committed: 3,
  Done: 4,
  Burned: 5
}

export const AssessmentFilterView = (props) => {
  let userAddress = props.userAddress

  // map assessmentList from assessments object from redux store
  let assessmentList = Object.keys(props.assessments).map((assessmentAddress) => { //TODO: no need to add address field. just turn it into list
    return {...props.assessments[assessmentAddress], address: assessmentAddress}
  })

  let assessmentLists = {
    Current: assessmentList.filter(assessment => {
      if (props.userAddress === assessment.assessee) {
        return assessment.stage < Stage.Done
      }
      return assessment.stage > Stage.Called && assessment.stage < Stage.Done
    }),
    Available: assessmentList.filter(assessment => {
      return (props.userAddress !== assessment.assessee &&
              assessment.stage === Stage.Called)
    }),
    Completed: assessmentList.filter(assessment => assessment.stage === Stage.Done)
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
