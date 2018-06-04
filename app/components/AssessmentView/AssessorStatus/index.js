import { connect } from 'react-redux'
import AssessorStatus from './AssessorStatus.js'
import { confirmAssessor, commit, reveal } from '../../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.assessmentAddress &&
             tx.sender === ownProps.assessorAddress &&
             tx.data === ownProps.stage)
    ),
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
