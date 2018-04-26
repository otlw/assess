import { connect } from 'react-redux'
import AssessmentView from './AssessmentView'
import {fetchAssessmentData, fetchAssessmentViewData} from '../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id],
    userAddress: state.ethereum.userAddress
  }
}

const mapDispatchToProps = {
  fetchAssessmentData,
  fetchAssessmentViewData
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentView)
