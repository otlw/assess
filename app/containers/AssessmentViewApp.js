import { connect } from 'react-redux'
import AssessmentViewApp from '../components/assessmentView/'
import { fetchAssessmentData, setAssessment } from '../actions/async'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    selectedAssessment: state.assessments.selectedAssessment
  }
}

const mapDispatchToProps = {
  fetchAssessmentData,
  setAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewApp)
