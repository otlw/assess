import { connect } from 'react-redux'
import { compose } from 'redux'
import AssessmentCard from './AssessmentCard.js'

import { toggleCardVisibility } from '../../actions/assessmentActions.js'

const mapDispatchToProps = {
	toggleCardVisibility
}

export default connect(null, mapDispatchToProps)(AssessmentCard)