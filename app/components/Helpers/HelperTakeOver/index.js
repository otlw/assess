import { connect } from 'react-redux'
import HelperTakeOver from './HelperTakeOver.js'
import { updateHelperScreen } from '../../../actions/navigationActions.js'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {
  updateHelperScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperTakeOver)
