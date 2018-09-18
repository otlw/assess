import { connect } from 'react-redux'
import AssessmentCard from './AssessmentCard.js'

import { setCardVisibility } from '../../../actions/assessmentActions.js'

const mapDispatchToProps = {
  setCardVisibility
}

export default connect(null, mapDispatchToProps)(AssessmentCard)
