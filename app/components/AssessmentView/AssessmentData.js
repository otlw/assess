import { Component } from 'react'
var h = require('react-hyperscript')

export class AssessmentData extends Component {
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
        ])
      ])
    )
  }
}

export default AssessmentData
