import React, { Component } from 'react'
var h = require('react-hyperscript')

const stages = {
  '1': 'Called',
  '2': 'Staked',
  '3': 'Committed',
  '4': 'Done',
  '5': 'Burned'
}


// component to display an individual assessor slot address and options
export class AssessorStatus extends Component {

  stake() {
  }

  commit() {
  }

  reveal() {
  }

  steal() {
  }

  render() {
    let displayString = 'assessor ' + this.props.assessorNumber + ": " + this.props.assessorAddress
    let active = this.props.assessorStage === this.props.stage
    let buttonString = ''
    switch (this.props.stage) {
        // calling phase
      case 1:
        if (active) { //TODO use active in buttonElement
          buttonString = 'stakeButton'
        } else {
          buttonString = 'greyedOutStakeButton'
        }
        break
        // committing phase
        /* case 2:
         *   if (active) { //TODO use active in buttonElement
         *     buttonString = 'commitButton'
         *   } else {
         *     buttonString = 'greyedOutCommitButton'
         *   }
         *   break */
      default:
        console.log('somehting wnet wrong. stage is', typeof this.props.stage)
        buttonString =  h('div', 'something went wrong')
    }
    return (
      h('div', [
        h('span', displayString),
        h('span', buttonString)
      ])
    )
  }
}

AssessorStatus.propTypes = {
  assessorAddress:  React.PropTypes.string.isRequired,
  assessorNumber:  React.PropTypes.number.isRequired
}

export default AssessorStatus
