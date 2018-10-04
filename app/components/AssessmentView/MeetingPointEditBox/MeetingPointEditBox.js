import { Component } from 'react'
import styled from 'styled-components'
import MeetingPointForm from './MeetingPointForm.js'
import buttonTertiary from '../../global/buttonTertiary.ts'
var h = require('react-hyperscript')

class MeetingPointEditBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayMPEdit: false
    }
  }

  storeData (values) {
    this.props.storeDataOnAssessment(this.props.assessmentAddress, values.data)
    this.setState({displayMPEdit: false})
  }

  toggleMPeditability () {
    this.setState({displayMPEdit: !this.state.displayMPEdit})
  }

  render () {
    return (
      h('div', [
        h(buttonTertiary, {
          onClick: this.toggleMPeditability.bind(this)
        }, 'Edit'),
        // ALEX work magic here, por favor
        this.state.displayMPEdit ? h(MeetingPointForm, {onSubmit: this.storeData.bind(this)}) : null
      ])
    )
  }
}

export default MeetingPointEditBox

export const ViewMeetingPoint = styled('button')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const EditMeetingPoint = styled('button')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
