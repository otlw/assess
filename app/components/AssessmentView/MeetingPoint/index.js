import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../store/assessment/asyncActions'
import { setInputBar } from '../../../store/navigation/actions'
import MeetingPointEditBox from './MeetingPointEditBox.js'

const mapDispatchToProps = {
  storeDataOnAssessment,
  setInputBar
}

export default connect(null, mapDispatchToProps)(MeetingPointEditBox)
