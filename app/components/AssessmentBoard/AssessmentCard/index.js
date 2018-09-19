import { connect } from 'react-redux'
import AssessmentCard from './AssessmentCard.js'

import { setCardVisibility } from '../../../store/assessment/actions'

const mapDispatchToProps = {
  setCardVisibility
}

export default connect(null, mapDispatchToProps)(AssessmentCard)
