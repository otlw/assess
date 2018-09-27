import { connect } from 'react-redux'
import Modal from './Modal.js'
import { setModal } from '../../../store/navigation/actions.ts'
import { helperText } from '../helperContent.js'

const mapStateToProps = state => {
  return {
    topic: helperText(state.navigation.modal)
  }
}

const mapDispatchToProps = {
  setModal
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
