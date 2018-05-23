import { connect } from 'react-redux'
import AssessorStatus from './AssessorStatus.js'
import { confirmAssessor, commit, reveal } from '../../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.assessmentAddress &&
             tx.sender === ownProps.assessorAddress &&
             tx.stage === ownProps.stage)
    )
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessorStatus)
