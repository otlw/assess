import { connect } from 'react-redux'
import FailedBar from './FailedBar.js'
import { refund } from '../../../store/assessment/asyncActions'

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: ownProps.assessment,
    userAddress: ownProps.userAddress
  }
}

const mapDispatchToProps = {
  refund
}

export default connect(mapStateToProps, mapDispatchToProps)(FailedBar)
