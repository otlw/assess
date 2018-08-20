import { connect } from 'react-redux'
import FailedBar from './FailedBar.js'
import { refund } from '../../../actions/assessmentActions.js'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = {
  refund
}

export default connect(mapStateToProps, mapDispatchToProps)(FailedBar)
