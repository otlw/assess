import { connect } from 'react-redux'
import ProgressAndInputBar from './ProgressAndInputBar.js'
import { setInputBar } from '../../../store/navigation/actions'
import { confirmAssessor, commit, reveal, storeDataOnAssessment } from '../../../store/assessment/asyncActions'

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
    checkpoint: state.assessments[ownProps.assessmentAddress].checkpoint,
    inputType: state.navigation.inputBar
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal,
  storeDataOnAssessment,
  setInputBar
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressAndInputBar)
