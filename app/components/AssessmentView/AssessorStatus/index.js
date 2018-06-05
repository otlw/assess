import { connect } from 'react-redux'
import AssessorStatus from './AssessorStatus.js'
import { confirmAssessor, commit, reveal } from '../../../actions/assessmentActions'

const mapStateToProps = state => {
  return {
    assessmentAddress: state.assessments.selectedAssessment,
    userAddress: state.ethereum.userAddress,
    stage: state.assessments[state.assessments.selectedAssessment].stage
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessorStatus)
