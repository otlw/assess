import AssessmentList from '../Dashboard/FilterView/AssessmentList.js'

import h from 'react-hyperscript'

const Stage = { // TODO import from constatns instead
  None: 0,
  Called: 1,
  Confirmed: 2,
  Committed: 3,
  Done: 4,
  Burned: 5
}

export const CertificateList = (props) => {
  let userAddress = props.userAddress
  let completedAsAssessee = Object.values(props.assessments).filter(
    assessment =>
      assessment.stage === Stage.Done &&
      assessment.assessee === props.userAddress &&
      assessment.finalScore >= 0
  )

  // return view
  return h(AssessmentList, {
    assessments: completedAsAssessee,
    name: 'You successfully completed these assessments:',
    userAddress: userAddress,
    networkID: props.networkID
  })
}

export default CertificateList
