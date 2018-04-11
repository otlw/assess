import { connect } from 'react-redux'
import AssessmentViewApp from '../components/assessmentView/'
import { fetchAssessmentData, setAssessment } from '../actions/async'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.userAddress,
    selectedAssessment: state.selectedAssessment
  }
}

const mapDispatchToProps = {
  fetchAssessmentData,
  setAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewApp)
