import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../actions/assessmentActions'
import MeetingPoint from './MeetingPoint.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.address &&
             // tx.sender === ownProps.assessorAddress &&
             tx.data === 'meetingPointChange')
    )
  }
}

const mapDispatchToProps = {
  storeDataOnAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPoint)
