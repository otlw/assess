import { connect } from 'react-redux'
import ProgressButtonBar from './ProgressButtonBar.js'
import { confirmAssessor, commit, reveal } from '../../../actions/assessmentActions'

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
    cost: state.assessments[ownProps.address].cost
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressButtonBar)
