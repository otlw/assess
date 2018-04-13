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
     1: {function: this.stake, text: 'Stake!', disabled:false},
     2: {function: this.commit, text: 'Commit a score!', disabled:false},
     3: {function: this.reveal, text: 'Reveal your score!', disabled:false},
     4: {function: this.done, text: 'done!', disabled:true},
     5: {function: this.done, text: 'Burned!', disabled:true}
   }
   this.salt = 'hihi'
   this.score = 100
 }

  stake() {
    this.props.confirmAssessor(this.props.assessmentAddress)
  }

  commit() {
    window.alert("Please write down your salt:" + this.salt)
    this.props.commit(this.props.assessmentAddress, this.score, this.salt)
  }

  reveal() {
    this.props.reveal(this.props.assessmentAddress, this.score, this.salt)
  }

  steal() {
    //TODO
  }

  done() {
  }

  render() {
    let displayString = 'assessor ' + this.props.assessorNumber + ": " + this.props.assessorAddress + '... ->   '
    let active = this.props.assessorStage === this.props.stage
    let button = this.buttonLogic[this.props.assessorStage]
    if (active) {
      return (
        h('div', [
          h('span', displayString),
          h('button', {onClick: button.function.bind(this), disabled:button.disabled}, button.text)
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

export default AssessorStatus
