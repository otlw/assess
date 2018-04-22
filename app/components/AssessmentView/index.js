import { connect } from 'react-redux'
import AssessmentView from './AssessmentView.js'
import { fetchAssessmentData, fetchAssessors} from '../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id],
    userAddress: state.ethereum.userAddress
  }
}

const mapDispatchToProps = {
  fetchAssessmentData,
  fetchAssessors,
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentView)
