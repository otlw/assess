import React, { Component } from 'react'
import AssessorStatus from './AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {

  render() {
    let assessors = this.props.assessors
    if (assessors.hasOwnProperty('called')) {
      if (assessors.called.includes(this.props.userAddress)) {
        assessors.staked.push({
          address: 'you',
          stage: 1
        })
      }
    }
    if (assessors.hasOwnProperty('staked')) {
      assessors.staked.push({address:'testAssessor', stage: 1})
      return h('div',
               assessors.staked.map( (assessor,k) => {
                 return h(AssessorStatus, {
                   assessorAddress: assessor.address,
                   assessorNumber: k,
                   assessorStage: parseInt(assessor.stage),
                   stage: parseInt(this.props.stage),
                 })
               })
      )
    } else {
      console.log('could not find called assessors in ', JSON.stringify(assessors.called))
      return h('div', 'could not find assessors')
    }
  }
}

      export default AssessorList

      // AssessorList.propTypes = {
      //   assessors:  React.PropTypes.List.isRequired //TODO? how to describe the li
      // }
