import AssessmentList from '../AssessmentList.js'
import h from 'react-hyperscript'
import { Stage } from '../../constants.js'

export const CertificateList = (props) => {
  let userAddress = props.userAddress
  let completedAsAssessee = Object.values(props.assessments).filter(
    assessment =>
      assessment.stage === Stage.Done &&
      assessment.assessee === props.userAddress &&
      assessment.finalScore >= 50
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
