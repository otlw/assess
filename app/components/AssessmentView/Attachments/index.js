import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import { storeData, fetchStoredData } from '../../../actions/assessmentActions'
import MeetingPoint from './MeetingPoint.js'
import { LoadingStage } from '../../../constants.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === state.assessments.selectedAssessment &&
             // tx.sender === ownProps.assessorAddress &&
             tx.data === 'meetingPointChange')
    ),
    editable: state.ethereum.userAddress === ownProps.assessee,
    address: state.assessments.selectedAssessment,
    loadedMeetingPoint: state.loading.assessmentDetail.attachments === LoadingStage.Done,
    meetingPoint: state.assessments[state.assessments.selectedAssessment].data
  }
}

const mapDispatchToProps = {
  load: fetchStoredData,
  storeData
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(MeetingPoint)
