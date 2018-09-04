import { connect } from 'react-redux'
import HelperBar from './HelperBar.js'
import { resetVisits, setHelperBar } from '../../../actions/navigationActions.js'
import { helperScreens } from '../../../constants.js'

const mapStateToProps = state => {
  return {
    visits: state.navigation.visits,
    topic: helperScreens(state.navigation.helperBarTopic)
  }
}

const mapDispatchToProps = {
  resetVisits,
  setHelperBar
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperBar)
