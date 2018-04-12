import React, { Component } from 'react'
import AssessorStatus from './AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {

  render() {
    console.log('rednerList')
    let assessors = this.props.assessors
    /* console.log('assessors ',JSON.stringify(assessors) ) */
    /* console.log('assessors ',assessors ) */
    if (assessors.hasOwnProperty('called')) {
      console.log('hasOwnPropertyCalled', assessors.called)
      if (assessors.called.includes(this.props.userAddress)) {
        assessors.staked.push({
          address: 'you',
          stage: '1'
        })
      }
    }
    if (assessors.hasOwnProperty('staked')) {
      console.log('hasOwnPropertyStaked', assessors.staked)
      assessors.staked.push({address:'test', stage: 1})
      return h('div',
               assessors.staked.map( (assessor,k) => {
                 return h(AssessorStatus, {
                   assessorAddress: assessor.address,// === this.props.userAddress ? 'you!' : assessor.address
                   assessorNumber: k,
                   assessorStage: assessor.stage,
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
