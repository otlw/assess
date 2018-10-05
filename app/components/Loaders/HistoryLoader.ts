import {Component} from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'
import Web3 from 'web3'

import {State} from '../../store'
import {LoadingStage} from '../../store/loading/reducer'

import {loadPersistedState} from '../../store/loading/asyncActions'
// import {loadPersistedState} from '../../store/web3/asyncActions'
// import Modal from '../Helpers/Modal'

type Props = {
  historyLoadingState: LoadingStage
  // loadPersistedState: typeof loadPersistedState
  loadPersistedState: typeof loadPersistedState
  networkID: number,
  userAddress: string,
  web3: Web3
}

export class HistoryLoader extends Component<Props> {
  componentDidMount() {
    if(this.props.historyLoadingState === null) {
      console.log('called')
      this.props.loadPersistedState(this.props.networkID, this.props.userAddress, this.props.web3)
    }
  }

  render () {
    switch(this.props.historyLoadingState) {
      case null:
      case "Loading": {
        return h('div', 'Loadin visit history, yaaa')
      }
      case 'Error': {
        console.log('uiuiuiiiui')
        return h('div', 'iuiuiuiuuiiui')
        // return h(Modal)
      }
      case 'Loaded': {
        return this.props.children
      }
    }
  }
}

const mapStateToProps = (state:State) => {
  return {
    historyLoadingState: state.loading.history,
    networkID: state.ethereum.networkID,
    userAddress: state.ethereum.userAddress,
    web3: state.ethereum.web3
  }
}
const mapDispatchToProps = {
  loadPersistedState
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryLoader)
