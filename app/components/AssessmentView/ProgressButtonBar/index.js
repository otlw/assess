import { connect } from 'react-redux'
import ProgressButtonBar from './ProgressButtonBar.js'
import { confirmAssessor, commit, reveal } from '../../../actions/assessmentActions'

const mapStateToProps = state => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === state.assessments.selectedAssessment &&
             tx.sender === state.ethereum.userAddress &&
             tx.data === state.assessments[state.assessments.selectedAssessment].stage)
    ),
    assessmentAddress: state.assessments.selectedAssessment,
    userAddress: state.ethereum.userAddress,
    stage: state.assessments[state.assessments.selectedAssessment].stage,
    userStage: state.assessments[state.assessments.selectedAssessment].userStage,
    cost: state.assessments[state.assessments.selectedAssessment].cost
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressButtonBar)
