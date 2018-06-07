import { Component } from 'react'
import AssessorStatusBox from '../AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {
  render () {
    if (this.props.loadedAssessors) {
      return h('div',
        this.props.assessors.map((assessor, k) => {
          return h(AssessorStatusBox, {
            assessorAddress: assessor.address,
            assessorNumber: k,
            assessorStage: parseInt(assessor.stage),
            payout: assessor.stage === '4' ? this.props.payouts[assessor.address] : ''
          })
        })
      )
    } else {
      return h('div', 'Loading assessors...')
    }
  }
}

export default AssessorList
