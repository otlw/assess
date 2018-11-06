import CertificateCard from './CertificateCard.js'
import AssessmentList from '../AssessmentBoard/AssessmentList.js'
import { Assessment } from '../../store/assessment/reducer'
import h from 'react-hyperscript'

type Props = {
  assessments: Assessment[]
  loggedInUser: string
  userAddress: string
}
export const CertificateList = (props: Props) => {
  let name = props.userAddress + "'s Certifiactes"
  if (props.loggedInUser.toLowerCase() === props.userAddress.toLowerCase()) {
    name = 'Your Certificates'
  }
  return h(AssessmentList, {
    assessmentCard: CertificateCard,
    assessments: props.assessments,
    name,
    userAddress: props.userAddress
  })
}

export default CertificateList
