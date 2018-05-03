import { Component } from 'react'
import AssessorStatusBox from './AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {
  render () {
    return h('div',
      this.props.assessors.map((assessor, k) => {
        return h(AssessorStatusBox, {
          assessorAddress: assessor.address,
          assessmentAddress: this.props.assessmentAddress,
          assessorNumber: k,
          assessorStage: parseInt(assessor.stage),
          stage: parseInt(this.props.stage),
          userAddress: this.props.userAddress
        })
      })
    )
  }
}

export default AssessorList
