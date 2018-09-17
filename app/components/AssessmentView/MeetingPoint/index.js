import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../actions/assessmentActions'
import { dispatchSetInputBar } from '../../../actions/navigationActions.js'
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
  dispatchSetInputBar
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPointEditBox)
