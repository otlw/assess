import { connect } from 'react-redux'
import FailedBar from './FailedBar.js'
import { refund } from '../../../actions/assessmentActions.js'

const mapStateToProps = (state, ownProps) => {
  return {
    transactions: Object.values(state.transactions).filter(
      tx => (tx.address === ownProps.assessment.address &&
             tx.data === 'Refund')
    )
  }
}

const mapDispatchToProps = {
  refund
}

export default connect(mapStateToProps, mapDispatchToProps)(FailedBar)
