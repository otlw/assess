import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../store/assessment/asyncActions'
import MeetingPoint from './MeetingPoint.js'

const mapDispatchToProps = {
  storeDataOnAssessment
}

export default connect(null, mapDispatchToProps)(MeetingPoint)
