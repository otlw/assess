import { Component } from 'react'
var h = require('react-hyperscript')

// component to display an individual assessor slot address and options
export class AssessorStatus extends Component {
  constructor (props) {
    super(props)
    this.buttonLogic = {
      1: {function: this.stake, text: 'Stake!'},
      2: {function: this.commit, text: 'Commit a score!'},
      3: {function: this.reveal, text: 'Reveal your score!'},
      4: {function: this.done, text: 'done!'},
      5: {function: this.done, text: 'Burned!'}
    }
    // state contains local variables that would rerender the component
    this.state = {
      score: 100,
      salt: 'hihi'
    }
  }

  setScore (e) {
    let score = Number(e.target.value)
    if (score >= 0 && score <= 100) {
      this.setState({score: score})
    }
  }

  stake () {
    this.props.confirmAssessor(this.props.assessmentAddress)
  }

  commit () {
    window.alert('Please write down your salt:' + this.state.salt)
    this.props.commit(this.props.assessmentAddress, this.state.score, this.state.salt)
  }

  reveal () {
    this.props.reveal(this.props.assessmentAddress, this.state.score, this.state.salt)
  }

  steal () {
    // TODO
  }

  done () {
  }

  render () {
    let displayString = 'assessor ' + (this.props.assessorNumber + 1) + ': ' + this.props.assessorAddress + '... ->   '
    let active = this.props.assessorStage === this.props.stage
    let button = this.buttonLogic[this.props.assessorStage]
    let input = null
    if (this.props.assessorStage === 2) {
      input = h('div', {style: {display: 'inline-block'}}, [
        h('div', {style: {fontSize: '0.7em', color: 'lightgrey', fontStyle: 'italic'}}, 'must be 0 <= score <= 100'),
        h('input', {value: this.state.score, type: 'number', onChange: this.setScore.bind(this)})
      ])
    }
    if (active) {
      return (
        h('div', [
          h('span', displayString),
          input,
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

export default AssessorStatus
