import { connect } from 'react-redux'
import AssessorStatus from './AssessorStatus.js'
import { confirmAssessor, commit, reveal } from '../../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  let address = ownProps.assessmentAddress
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === address &&
             tx.sender === ownProps.assessorAddress &&
             tx.data === state.assessments[address].stage)
    ),
    userAddress: state.ethereum.userAddress
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessorStatus)
