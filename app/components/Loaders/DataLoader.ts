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
    if (this.props.DataLoadingState === 'Initial') {
      this.props.ConnectData()
    }
  }

  render () {
    switch (this.props.DataLoadingState) {
    case null:
    case 'Loading': {
      return h('div', 'Loading Data')
    }
    case 'Error': {
      return h(Modal)
    }
    case 'Loaded': {
      return this.props.children
    }
    default: {
      return h('div', 'Loading Data')
    }
    }
  }
}

const mapStateToProps = (state: State) => {
  return {
    DataLoadingState: state.loading.stage
  }
}
const mapDispatchToProps = {
  ConnectData
}

export default connect(mapStateToProps, mapDispatchToProps)(DataLoader)
