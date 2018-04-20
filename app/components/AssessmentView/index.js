import { connect } from 'react-redux'
import AssessmentView from './AssessmentView.js'
import { fetchAssessmentData,
         fetchAssessors,
         setAssessment } from  '../../actions/assessmentActions'

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

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentView)
