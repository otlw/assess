import { connect } from 'react-redux'
import HelperBar from './HelperBar.js'
import { resetVisits, setHelperScreen } from '../../actions/navigationActions.js'
import { helperScreens } from '../../constants.js'

const mapStateToProps = state => {
  return {
    visits: state.navigation.visits,
    screen: helperScreens(state.navigation.helperScreen)
  }
}

const mapDispatchToProps = {
  resetVisits,
  setHelperScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperBar)
