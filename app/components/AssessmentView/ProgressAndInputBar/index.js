import { connect } from 'react-redux'
import ProgressAndInputBar from './ProgressAndInputBar.js'
import { dispatchSetInputBar } from '../../../actions/navigationActions'
import { confirmAssessor, commit, reveal, storeDataOnAssessment } from '../../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.assessmentAddress &&
             tx.sender === state.ethereum.userAddress &&
             tx.data === state.assessments[ownProps.assessmentAddress].stage)
    ),
    assessmentAddress: ownProps.assessmentAddress,
    userAddress: state.ethereum.userAddress,
    stage: state.assessments[ownProps.assessmentAddress].stage,
    userStage: state.assessments[ownProps.assessmentAddress].userStage,
    cost: state.assessments[ownProps.assessmentAddress].cost,
    inputType: state.navigation.inputBar
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal,
  storeDataOnAssessment,
  dispatchSetInputBar
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressAndInputBar)
