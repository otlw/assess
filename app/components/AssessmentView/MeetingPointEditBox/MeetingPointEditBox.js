import { Component } from 'react'
import styled from 'styled-components'
import inputField from '../../Global/inputField.ts'
import {ButtonTertiary} from '../../Global/Buttons'
var h = require('react-hyperscript')

class MeetingPointEditBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayMPEdit: false,
      newMeetingPoint: ''
    }
  }

  storeData (values) {
    this.props.storeDataOnAssessment(this.props.assessmentAddress, this.state.newMeetingPoint)
    this.setState({displayMPEdit: false})
  }

  toggleMPeditability () {
    this.setState({displayMPEdit: !this.state.displayMPEdit})
  }

  setNewMeetingPoint (e) {
    this.setState({newMeetingPoint: e.target.value})
  }

  render () {
    return (
      h('div', [
        h(ButtonTertiary, {
          onClick: this.toggleMPeditability.bind(this)
        }, 'Edit'),
        this.state.displayMPEdit
          ? h('div', [
            h(inputField, {
              type: 'string',
              onChange: this.setNewMeetingPoint.bind(this),
              // value: this.state.newMeetingPoint
              defaultValue: 'gitlab.com/myProject/...'
            }),
            h(ButtonTertiary, {onClick: this.storeData.bind(this)},  'Submit!')
          ])
        : null
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
