import { Component } from 'react'
import h from 'react-hyperscript'
import styled from 'styled-components'
import ToggleButton from 'react-toggle-button'

const assessmentListStyle = {
  frame: {
    padding: '1em',
    border: '0.5px solid lightgrey'
  }
}

// TODO: set a `loading` property in state, render 'loading...' until data is loaded
export class AssessmentListToggle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activateHidden: false
    }
    this.toggleHidden = this.toggleHidden.bind(this)
  }

  toggleHidden (e) {
    this.setState({activateHidden: !this.state.activateHidden})
  }

  render () {
    let hiddenPrefs = this.state.activateHidden
    let filteredList = this.props.assessments.filter(assessment => assessment.hidden === hiddenPrefs)

    let listContent = (filteredList.length === 0)
      ? h('div', {style: assessmentListStyle.frame}, ['None'])
      : h(listContainerCards, filteredList.map((assessment, k) => {
        return h(this.props.assessmentCard, {
          assessment,
          userAddress: this.props.userAddress,
          networkID: this.props.networkID
        })
      }))

    return (h(listContainer, [
      h(availableHeader, [
        h('h1', this.props.name),
        h(styledToggleWrapper, [
          h(styledToggleLabel, {active: this.state.activateHidden}, 'Show Hidden'),
          h(ToggleButton, {value: this.state.activateHidden, onToggle: this.toggleHidden})
        ])
      ]),
      listContent
    ]))
  }
}

const availableHeader = styled('div')`
  display: flex;
  justify-content: space-between;
`
const styledToggleWrapper = styled('div')`
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;
  width: 200px;
`
const styledToggleLabel = styled('h4')`
  color: ${props => props.active ? 'green' : '#8c8c8c'}
`

const listContainer = styled('div').attrs({className: 'flex flex-column w-100'})``

const listContainerCards = styled('div').attrs({className: 'flex flex-row flex-wrap w-100 justify-center'})``

export default AssessmentListToggle
