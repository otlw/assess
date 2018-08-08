import CardCertificate from '../CardCertificate.js'
import AssessmentList from '../AssessmentList.js'
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
    assessmentCard: CardCertificate,
    assessments: completedAsAssessee,
    name: 'You successfully completed these assessments:',
    userAddress: props.userAddress
  })
}

export default CertificateList
