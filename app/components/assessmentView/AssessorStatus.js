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
 constructor(props) {
   super(props)
   this.buttonLogic = {
     1: {function: this.stake, text: 'Stake!'},
     2: {function: this.commit, text: 'Commit a score!'},
     3: {function: this.reveal, text: 'Reveal your score!'},
   }
 }

  stake() {
    this.props.confirmAssessor(this.props.assessmentAddress)
  }

  commit() {
  }

  reveal() {
  }

  steal() {
  }

  render() {
    let displayString = 'assessor ' + this.props.assessorNumber + ": " + this.props.assessorAddress.slice(0,9) + '... ->   '
    let active = this.props.assessorStage === this.props.stage
    let button = this.buttonLogic[this.props.assessorStage]
    if (active) {
      return (
        h('div', [
          h('span', displayString),
          h('button', {onClick: button.function.bind(this)}, button.text)
        ])
      )
    } else {
      return (
        h('div', [
          h('span', displayString),
          h('span', 'Waiting for others')
        ])
      )
    }
  }
}

AssessorStatus.propTypes = {
  assessorAddress:  React.PropTypes.string.isRequired,
  assessorNumber:  React.PropTypes.number.isRequired
}

export default AssessorStatus
