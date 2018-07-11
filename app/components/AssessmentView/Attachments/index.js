import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../actions/assessmentActions'
import MeetingPointEditButton from './MeetingPoint.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.address &&
             tx.data === 'meetingPointChange')
    ),
    address: state.assessments.selectedAssessment,
    meetingPoint: state.assessments[state.assessments.selectedAssessment].data
  }
}

const mapDispatchToProps = {
  storeData: storeDataOnAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPointEditButton)
