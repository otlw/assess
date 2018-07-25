import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../actions/assessmentActions'
import MeetingPointEditBox from './MeetingPointEditBox.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.address &&
             tx.data === 'meetingPointChange')
    )
  }
}

const mapDispatchToProps = {
  storeDataOnAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPointEditBox)
