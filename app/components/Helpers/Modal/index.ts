import { connect } from 'react-redux'
import Modal from './Modal'
import { setModal } from '../../../store/navigation/actions'
import { helperText } from '../helperContent'
import {State} from '../../../store'

export type Props = {
  topic: ReturnType<typeof helperText>
  setModal: typeof setModal
}
const mapStateToProps = (state:State) => {
  return {
    topic: helperText(state.navigation.modal)
  }
}

const mapDispatchToProps = {
  setModal
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
