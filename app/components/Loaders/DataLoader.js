import { Component } from 'react'
import { LoadingStage } from '../../constants.js'
import { connect } from 'react-redux'
import styled from 'styled-components'
import h from 'react-hyperscript'
import {loadAllData} from '../../store/web3/asyncActions.js'

/* @purpose: read all data necessary from chain
   */
export class DataLoader extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     step: 1,
  //     amountPerAssessor: 0,
  //     gasEstimate: 0
  //   }

  componentDidMount () {
    if (this.props.dataLoadingState === null) {
      this.props.loadAllData()
    }
  }

  render () {
    switch (this.props.dataLoadingState) {
      case null:
      case 'Loading': {
        return h('div', 'Fetching Data from chain...')
      }
      case 'Error': {
        return h('div', 'Error: while reading XXX-data from chain!!') // TODO
      }
      case 'Loaded': {
        return this.props.children
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    dataLoadingState: isAllDataLoaded(state)
  }
}
const mapDispatchToProps = {
  loadAllData,
}

const isAllDataLoaded = (state) => {
  if (state.loading.blockData === 'Loaded' &&
      state.loading.assessments === LoadingStage.Done &&
      state.loading.concepts === LoadingStage.Done) {
    return 'Loaded'
  } else {
    return state.loading.blockData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataLoader)
