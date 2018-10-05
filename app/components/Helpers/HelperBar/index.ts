import { connect } from 'react-redux'
import HelperBar from './HelperBar'
import { setHelperBar, setModal } from '../../../store/navigation/actions'
import { helperBarText } from '../helperContent'
import {State} from '../../../store'

export type Props = {
  topic: ReturnType<typeof helperBarText>
  setModal: typeof setModal
  setHelperBar: typeof setHelperBar
  showBar: boolean
}

const mapStateToProps = (state:State) => {
  return {
    // visits: state.navigation.visits, // TODO this will be used to decide whether the user is a novice or not
    topic: helperBarText(state.navigation.helperBar),
    showBar: state.navigation.helperBar !== null
  }
}

const mapDispatchToProps = {
  // resetVisits,
  setHelperBar,
  setModal
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperBar)
