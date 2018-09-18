import CertificateCard from './CertificateCard.js'
import AssessmentList from '../AssessmentBoard/AssessmentList.js'
import h from 'react-hyperscript'
import { Stage } from '../../constants.js'

export const CertificateList = (props) => {
  let completedAsAssessee = Object.values(props.assessments).filter(
    assessment =>
      assessment.stage === Stage.Done &&
      assessment.assessee === props.userAddress &&
      assessment.finalScore >= 50
  )
  // return view
  return h(AssessmentList, {
    assessmentCard: CertificateCard,
    assessments: completedAsAssessee,
    name: 'Your Certificates',
    userAddress: props.userAddress
  })
}

export default CertificateList
