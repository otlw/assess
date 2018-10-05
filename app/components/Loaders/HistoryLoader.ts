import {Component} from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'
import Web3 from 'web3'

import {State} from '../../store'
import {LoadingStage} from '../../store/loading/reducer'

import {loadPersistedState} from '../../store/loading/asyncActions'

// REFACTOR: as this component is really similar to MetamaskLoader, maybe there a way to generalize it!
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
