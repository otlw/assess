import { Component } from 'react'
import AssessorStatusBox from '../AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {
  render () {
    if (this.props.loadedAssessors) {
      let assessorLines = []
      let k = 0
      if (this.props.assessorStages) {
        for (let assessor of Object.keys(this.props.assessorStages)) {
          assessorLines.push(
            h(AssessorStatusBox, {
              assessorAddress: assessor,
              assessorNumber: k,
              assessorStage: parseInt(this.props.assessorStages[assessor]),
              payout: assessor.stage === '4' ? this.props.payouts[assessor] : ''
            })
          )
          k++
        }
      }
      return h('div', assessorLines)
    } else {
      return h('div', 'Loading assessors...')
    }
  }
}

export default AssessorList
