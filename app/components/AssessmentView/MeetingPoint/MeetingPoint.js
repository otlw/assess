import { Component } from 'react'
import styled from 'styled-components'
import inputField from '../../Global/inputField.ts'
import {ButtonTertiary} from '../../Global/Buttons'
import { Label, Body } from '../../Global/Text.ts'

var h = require('react-hyperscript')

class MeetingPoint extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayMPEdit: false,
      newMeetingPoint: ''
    }
  }

  storeData (values) {
    this.props.storeDataOnAssessment(this.props.assessment.address, this.state.newMeetingPoint)
    this.setState({displayMPEdit: false})
  }

  toggleMPeditability () {
    this.setState({displayMPEdit: !this.state.displayMPEdit})
  }

  setNewMeetingPoint (e) {
    this.setState({newMeetingPoint: e.target.value})
  }

  meetingPointString (isAssessee, assessment) {
    return h(Body, [
      assessment.data
        ? h('a', {href: assessment.data}, assessment.data)
        : isAssessee
          ? 'You haven\'t set a meeting point'
          : 'No meeting point has been set yet'
    ])
  }

  render () {
    return (
      h('div', [
        h('div', [ // First Row
          h(assessmentLabelContainerMP, [
            h(Label, 'Meeting Point'),
            !this.props.isAssessee
              ? null
              : h(ButtonTertiary, {
                onClick: this.toggleMPeditability.bind(this)
              }, !this.state.displayMPEdit ? 'Edit' : 'X')
          ])
        ]),
        h('div', [ // second row
          !this.state.displayMPEdit
            ? this.meetingPointString(this.props.isAssessee, this.props.assessment)
            : h(containerMeetingPointInput, [
              h(inputField, {
                type: 'string',
                onChange: this.setNewMeetingPoint.bind(this),
                // value: this.state.newMeetingPoint
                defaultValue: 'gitlab.com/myProject/...'
              }),
              h(ButtonTertiary, {onClick: this.storeData.bind(this)}, 'Submit')
            ])
        ])
      ])
    )
  }
}

export default MeetingPoint

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

export const assessmentLabelContainerMP = styled('div').attrs({className: 'flex flex-row w-100 mb2 items-center justify-between'})`
`

export const containerMeetingPointInput = styled('div').attrs({className: 'flex flex-row w-100'})`
`
