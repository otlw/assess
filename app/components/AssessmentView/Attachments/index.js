import { connect } from 'react-redux'
import { storeDataOnAssessment } from '../../../actions/assessmentActions'
import MeetingPoint from './MeetingPoint.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.address &&
             tx.data === 'meetingPointChange')
    ),
    editable: state.ethereum.userAddress === ownProps.assessee
  }
}

const mapDispatchToProps = {
  storeData: storeDataOnAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPoint)
