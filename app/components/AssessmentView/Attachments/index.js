import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../actions/assessmentActions'
import MeetingPoint from './MeetingPoint.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === state.assessments.selectedAssessment &&
             tx.data === 'meetingPointChange')
    ),
    editable: state.ethereum.userAddress === ownProps.assessee,
    address: state.assessments.selectedAssessment,
    meetingPoint: state.assessments[state.assessments.selectedAssessment].data
  }
}

const mapDispatchToProps = {
  storeData: storeDataOnAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPoint)
