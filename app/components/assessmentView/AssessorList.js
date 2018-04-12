import React, { Component } from 'react'
import AssessorStatusBox from '../../containers/AssessorStatusBox'
import AssessorStatus from './AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {

  render() {
    // if user has not staked but has been called, add him to the staked-list with status 'Called'
    let assessors = this.props.assessors
    console.log('assessors ',assessors )
    let userHasStaked = assessors.staked.filter(a => a.address === this.props.userAddress)
    if (userHasStaked.length === 0  &&
        assessors.called.includes(this.props.userAddress)) {
      assessors.staked.push({
        address: 'you',
        stage: 1
      })
    }
    assessors.staked.push({address:'testAssessor', stage: 1})
    return h('div',
             assessors.staked.map( (assessor,k) => {
               return h(AssessorStatusBox, {
                 assessorAddress: assessor.address,
                 assessmentAddress: this.props.address,
                 assessorNumber: k,
                 assessorStage: parseInt(assessor.stage),
                 stage: parseInt(this.props.stage),
               })
             })
    )
  }
}

export default AssessorList

      // AssessorList.propTypes = {
      //   assessors:  React.PropTypes.List.isRequired //TODO? how to describe the li
      // }
