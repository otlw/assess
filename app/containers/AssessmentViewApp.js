import { connect } from 'react-redux'
import AssessmentViewApp from '../components/assessmentView/'
import { fetchAssessmentData,
         fetchAssessors,
         setAssessment } from '../actions/async'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    selectedAssessment: state.assessments.selectedAssessment,
    userAddress: state.connect.userAddress
  }
}

const mapDispatchToProps = {
  fetchAssessmentData,
  fetchAssessors,
  setAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewApp)
