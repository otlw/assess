import { connect } from 'react-redux'
import AssessmentView from './AssessmentView'
import {
  fetchAssessmentData,
  fetchAssessmentViewData,
  isValidAssessmentAddress
} from '../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id],
    userAddress: state.ethereum.userAddress,
    validAssessmentAddress: state.assessments.validAssessmentViewAddress
  }
}

const mapDispatchToProps = {
  fetchAssessmentData,
  fetchAssessmentViewData,
  isValidAssessmentAddress
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentView)
