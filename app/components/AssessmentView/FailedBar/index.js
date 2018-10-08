import { connect } from 'react-redux'
import FailedBar from './FailedBar.js'
import { refund } from '../../../store/assessment/asyncActions'

const mapDispatchToProps = {
  refund
}

export default connect(null, mapDispatchToProps)(FailedBar)
