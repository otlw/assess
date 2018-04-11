import React, { Component } from 'react'
import AssessorStatus from './AssessorStatus'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {

  render() {
    // find out stage of existing assessors and fill up with dummy assessors
    if (this.props.assessors) {
      let assessorSlots = []
      for (let i=0; i<this.props.size; i++){
        if (this.props.assessors[i]) {
          /* let assessmentInstance = this.props.web3.eth.Contract(assessmentABI,this.props.address) */ //TODO actually get the stage
          assessorSlots.push({
            address: this.props.assessors[i],
            stage: parseInt(this.props.stage) + 1
          })
        } else {
          assessorSlots.push({
            address: 'none',
            stage:  parseInt(this.props.stage)
          })
        }
      }
      console.log('assessorSlots ',assessorSlots )
      return h('div',
               assessorSlots.map( (assessor,k) => {
                 return h(AssessorStatus, {
                   assessorAddress: assessor.address,
                   assessorNumber: k,
                   assessorStage: assessor.stage,
                   stage: parseInt(this.props.stage),
                 })
               }))
    } else {
      return h('div', 'no assessment')
    }
  }
}

export default AssessorList

// AssessorList.propTypes = {
//   assessors:  React.PropTypes.List.isRequired //TODO? how to describe the li
// }
 
