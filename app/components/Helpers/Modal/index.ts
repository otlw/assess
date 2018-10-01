import { connect } from 'react-redux'
import Modal from './Modal'
import { setModal } from '../../../store/navigation/actions'
import { modalText } from '../helperContent'
import {State} from '../../../store'

export type Props = {
  topic: ReturnType<typeof modalText>
  setModal: typeof setModal
}

const mapStateToProps = (state:State) => {
  return {
    topic: modalText(state.navigation.modal)
  }
}

const mapDispatchToProps = {
  setModal
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
