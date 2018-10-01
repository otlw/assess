import { connect } from 'react-redux'
import AssessmentCard from './AssessmentCard.js'
import { setCardVisibility } from '../../../store/assessment/actions'
import { setModal } from '../../../store/navigation/actions'

const mapDispatchToProps = {
  setCardVisibility,
  setModal
}

export default connect(null, mapDispatchToProps)(AssessmentCard)
