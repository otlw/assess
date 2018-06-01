import { Component } from 'react'
import AssessmentList from './AssessmentList'

import h from 'react-hyperscript'

const filterViewStyles = {
  mainFrameStyle: {
    border: '0.5px solid lightgrey',
    borderRadius: '1em',
    padding: '1em',
    marginTop: '2em'
  },
  tabStyle: {
    display: 'inline-block',
    padding: '0.3em 1em',
    borderRadius: '1em 1em 0 0',
    border: '0.5px solid lightgrey'
  }
}

export class AssessmentFilterView extends Component {
  setTab (e) {
    this.props.setDashboardTab(e.target.innerHTML)
  }

  render () {
    let userAddress = this.props.userAddress

    // map assessmentList from assessments object from redux store
    let assessmentList = Object.keys(this.props.assessments).map((assessmentAddress) => {
      return {...this.props.assessments[assessmentAddress], address: assessmentAddress}
    })

    // map tab components according to selected tab
    let tabs = ['Past', 'Current', 'Potential'].map((tabName) => {
      if (tabName === this.props.selectedTab) {
        return h('a', {style: {...filterViewStyles.tabStyle, color: 'blue'}, onClick: this.setTab.bind(this)}, tabName)
      } else {
        return h('a', {style: filterViewStyles.tabStyle, onClick: this.setTab.bind(this)}, tabName)
      }
    })

    // return view
    return h('div', {style: filterViewStyles.mainFrameStyle}, [
      h('div', tabs),
      h(AssessmentList, {assessmentList: assessmentList, userAddress: userAddress, selectedTab: this.props.selectedTab, networkID:this.props.networkID})
    ])
  }
}

export default AssessmentFilterView
