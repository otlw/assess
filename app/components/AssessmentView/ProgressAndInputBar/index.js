import { connect } from 'react-redux'
import ProgressAndInputBar from './ProgressAndInputBar.js'
import { dispatchSetInputBar } from '../../../actions/navigationActions.js'
import { confirmAssessor, commit, reveal, storeDataOnAssessment } from '../../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.address &&
             tx.sender === state.ethereum.userAddress &&
             tx.data === state.assessments[ownProps.address].stage)
    ),
    assessmentAddress: ownProps.address,
    userAddress: state.ethereum.userAddress,
    stage: state.assessments[ownProps.address].stage,
    userStage: state.assessments[ownProps.address].userStage,
    cost: state.assessments[ownProps.address].cost,
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
