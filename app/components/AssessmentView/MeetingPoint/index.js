import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../store/assessment/asyncActions'
import { setInputBar } from '../../../store/navigation/actions'
import MeetingPointEditBox from './MeetingPointEditBox.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.assessmentAddress &&
             tx.data === 'meetingPointChange')
    )
  }
}

const mapDispatchToProps = {
  storeDataOnAssessment,
  setInputBar
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPointEditBox)
