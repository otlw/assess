import { connect } from 'react-redux'
import AssessmentViewApp from '../components/assessmentView/'
import { fetchAssessmentData,
         fetchAssessors,
         setAssessment } from '../actions/async'

const mapStateToProps = state => {
  return {
    assessment: state.assessments[state.assessments.selectedAssessment],
    selectedAssessment: state.assessments.selectedAssessment,
    userAddress: state.ethereum.userAddress
  }
}

const mapDispatchToProps = {
  fetchAssessmentData,
  fetchAssessors,
  setAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewApp)
