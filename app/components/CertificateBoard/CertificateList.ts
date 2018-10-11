import CertificateCard from './CertificateCard.js'
import AssessmentList from '../AssessmentBoard/AssessmentList.js'
import h from 'react-hyperscript'
import {Assessment} from '../../store/assessment/reducer'

import { NavTabs } from '../NavTabs'
import HelperBar from '../Helpers/HelperBar'
import Modal from '../Helpers/Modal'

type Props = {
  assessments:  Assessment[]
  loggedInUser: string
  userAddress: string
}
export const CertificateList = (props:Props) => {
  let name = props.userAddress + "'s Certifiactes"
  if(props.loggedInUser.toLowerCase() === props.userAddress.toLowerCase()){
    name = 'Your Certificates'
  }
  return h('div', [
    h(NavTabs),
    h(HelperBar),
    h(Modal),
    h(AssessmentList, {
      assessmentCard: CertificateCard,
      assessments: props.assessments,
      name,
      userAddress: props.userAddress
    })
  ])
}

export default CertificateList
