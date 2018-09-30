import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../store/assessment/asyncActions'
import MeetingPointEditBox from './MeetingPointEditBox.js'

const mapDispatchToProps = {
  storeDataOnAssessment
}

export default connect(null, mapDispatchToProps)(MeetingPointEditBox)
