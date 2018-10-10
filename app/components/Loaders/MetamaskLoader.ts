import {Component} from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'

import {State} from '../../store'
import {ConnectMetamask} from '../../store/loading/asyncActions'
import {LoadingStage} from '../../store/loading/reducer'

import Modal from '../Helpers/Modal'

type Props = {
  MetamaskLoadingState: LoadingStage //LoadingState['metamask'],
  ConnectMetamask: typeof ConnectMetamask
}
export class MetamaskLoader extends Component<Props> {
  componentDidMount() {
    if(this.props.MetamaskLoadingState === null) {
      this.props.ConnectMetamask()
    }
  }

  render () {
    switch(this.props.MetamaskLoadingState) {
      case null:
      case "Loading": {
        return h('div', 'Loadin metamask')
      }
      case 'Error': {
        return h(Modal)
      }
      case 'Loaded': {
        return this.props.children
      }
    }
  }
}

const mapStateToProps = (state:State) => {
  return {
    MetamaskLoadingState: state.loading.metamask,
  }
}
const mapDispatchToProps = {
  ConnectMetamask
}


export default connect(mapStateToProps, mapDispatchToProps)(MetamaskLoader)
