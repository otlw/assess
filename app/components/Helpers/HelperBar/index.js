import { connect } from 'react-redux'
import HelperBar from './HelperBar.js'
import { resetVisits, updateHelperScreen } from '../../../actions/navigationActions.js'
import { helperText } from '../helperContent.js'

const mapStateToProps = state => {
  return {
    visits: state.navigation.visits,
    topic: helperText(state.navigation.helperBarTopic),
    showBar: state.navigation.helperTopic !== ''
  }
}

const mapDispatchToProps = {
  resetVisits,
  updateHelperScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperBar)
