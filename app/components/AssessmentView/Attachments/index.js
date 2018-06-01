import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import { storeData, fetchStoredData } from '../../../actions/assessmentActions'
import MeetingPoint from './MeetingPoint.js'
import { loadingStage } from '../../../actions/utils.js'

const mapStateToProps = (state, ownProps) => {
  return {
    editable: state.ethereum.userAddress === ownProps.assessee,
    address: state.assessments.selectedAssessment,
    loadedMeetingPoint: state.loading.assessmentDetail.attachments === loadingStage.Done,
    meetingPoint: state.assessments[state.assessments.selectedAssessment].data || state.assessments[ownProps.assessmentAddress].data
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
