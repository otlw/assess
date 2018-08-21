import { Component } from 'react'

import h from 'react-hyperscript'
import styled from 'styled-components'

const assessmentListStyle = {
  frame: {
    padding: '1em',
    border: '0.5px solid lightgrey'
  }
}

// TODO: activeTab should be highlighted in UI
// TODO: tabs should be rendered mo' better (e.g., in single row)
// TODO: set a `loading` property in state, render 'loading...' until data is loaded
export class AssessmentListTabbed extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTab: 'unhidden'// <-> 'hidden'
    }
    this.selectTab = this.selectTab.bind(this)
  }

  selectTab (e) {
    e.preventDefault()
    let activeTab = this.state.activeTab
    let clickedTab = e.target.value
    if (clickedTab !== activeTab) {
      this.setState({activeTab: clickedTab})
    }
  }

  render () {
    let activeTab = this.state.activeTab
    let listReducer = (accumulator, assessment) => {
      assessment.hidden ? accumulator.hidden.push(assessment) : accumulator.unhidden.push(assessment)
      return accumulator
    }
    let renderList = this.props.assessments.reduce(listReducer, {unhidden: [], hidden: []})[activeTab]

    let listContent
    if (renderList.length === 0) {
      listContent = h('div', {style: assessmentListStyle.frame}, ['None'])
    } else {
      listContent = h(listContainerCards, renderList.map((assessment, k) => {
        return h(this.props.assessmentCard, {
          assessment,
          userAddress: this.props.userAddress,
          networkID: this.props.networkID
        })
      }))
    }

    return (
      h(listContainer, [
        h('h1', this.props.name),
        h('div', 'Show:'),
        h('input', {readOnly: true, value: 'unhidden', onClick: this.selectTab}),
        h('input', {readOnly: true, value: 'hidden', onClick: this.selectTab}),
        listContent
      ])
    )
  }
}

const listContainer = styled('div').attrs({className: 'flex flex-column w-100'})``

const listContainerCards = styled('div').attrs({className: 'flex flex-row flex-wrap w-100 justify-center'})``

export default AssessmentListTabbed
