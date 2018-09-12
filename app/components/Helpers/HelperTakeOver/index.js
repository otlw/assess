import { connect } from 'react-redux'
import HelperTakeOver from './HelperTakeOver.js'
import { updateHelperScreen } from '../../../actions/navigationActions.js'
import { helperText } from '../helperContent.js'

const mapStateToProps = state => {
  return {
    topic: helperText(state.navigation.helperTakeOver)
  }
}

const mapDispatchToProps = {
  updateHelperScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperTakeOver)
