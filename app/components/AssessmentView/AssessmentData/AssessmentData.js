import { Component } from 'react'
import MeetingPointForm from './MeetingPointForm.js'
var h = require('react-hyperscript')

export class AssessmentData extends Component {
  sendData (values) {
    console.log(values)
    // this.props.storeDataOnAssessment()
  }

  render () {
    return (
      h('div', [
        h('div', [
          h('span', 'Assessment address:  '),
          h('span', this.props.address)
        ]),
        h('div', [
          h('span', 'Assesseee: '),
          h('span', this.props.assessee)
        ]),
        h('div', [
          h('span', 'cost: '),
          h('span', this.props.cost)
        ]),
        h('div', [
          h('span', 'size: '),
          h('span', this.props.size)
        ]),
        h('div', [
          h('span', 'stage: '),
          h('span', this.props.stage),
          h('span', ' (out of 4)')
        ]),
        h('div', '============Attachments================================='),
        h('div', [
          h(MeetingPointForm, {onSubmit: this.sendData}),
          h('span','Meeeeeting Point: '),
          // h('span', this.props.storedData[this.props.assessee])
        ])
      ])
    )
  }
}

export default AssessmentData
