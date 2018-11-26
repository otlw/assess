import { Component } from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'

import { State } from '../../store'
import { ConnectData } from '../../store/loading/asyncActions'
import { LoadingStage } from '../../store/loading/reducer'

import Modal from '../Helpers/Modal'

type Props = {
  DataLoadingState: LoadingStage // LoadingState['Data'],
  ConnectData: typeof ConnectData
}
export class DataLoader extends Component<Props> {
  componentDidMount () {
    if (this.props.DataLoadingState === null) {
      this.props.ConnectData()
    }
  }

  render () {
    switch (this.props.DataLoadingState) {
    case null:
    case 'Loading': {
      return h('div', 'Loadin Data')
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

const mapStateToProps = (state: State) => {
  return {
    DataLoadingState: state.loading.appData
  }
}
const mapDispatchToProps = {
  ConnectData
}

export default connect(mapStateToProps, mapDispatchToProps)(DataLoader)
