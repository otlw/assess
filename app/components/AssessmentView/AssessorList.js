import { Component } from 'react'
import AssessorStatusBox from './AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {
  render () {
    this.props.assessors.push({address: 'testAssessor', stage: 1})
    this.props.assessors.push({address: '0xf2a2E600Eb309A5d8A17C18756F65608bD5ce5Db', stage: 2})
    return h('div',
      this.props.assessors.map((assessor, k) => {
        return h(AssessorStatusBox, {
          assessorAddress: assessor.address,
          assessmentAddress: this.props.assessmentAddress,
          assessorNumber: k,
          assessorStage: parseInt(assessor.stage),
          stage: parseInt(this.props.stage)
        })
      })
    )
  }
}

export default AssessorList
