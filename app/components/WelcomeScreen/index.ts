import {Component} from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'

import {State} from '../../store'
import {ConnectMetamask} from '../../store/loading/asyncActions'
import {LoadingState} from '../../store/loading/reducer'

import App from '../../App'
import Modal from '../Helpers/Modal'

type Props = {
  MetamaskLoadingState: LoadingState['metamask'],
  ConnectMetamask: typeof ConnectMetamask
}
export class WelcomeScreen extends Component<Props> {
  componentDidMount() {
    if(this.props.MetamaskLoadingState === null) {
      this.props.ConnectMetamask()
    }
  }

  render() {
    switch(this.props.MetamaskLoadingState) {
      case null:
      case "Loading": {
        return h('div', 'Loadin metamask')
      }
      case 'Error': {
        return h(Modal)
      }
      case 'Loaded': {
        return h(App)
      }
    }
  }
}

const mapStateToProps = (state:State) => {
  return {
    MetamaskLoadingState: state.loading.metamask
  }
}
const mapDispatchToProps = {
  ConnectMetamask
}


export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)
