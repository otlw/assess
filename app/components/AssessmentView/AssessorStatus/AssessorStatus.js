import { Component } from 'react'
import h from 'react-hyperscript'
import styled from 'styled-components'

// styles
const Feedback = styled.div`
font-size: 0.7em; 
font-style: italic;
color:${props => props.wrongScore ? 'red' : 'lightgrey'};
`
const ActiveButton = styled.button`
//will add theme colors
color:blue;
`
const StaleButton = styled.span`
//will add theme colors
color:lightgrey;
`

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

    // get cache/localStorage data in case a score-salt has been commited
    let cacheCommitData = JSON.parse(window.localStorage.getItem(this.props.assessmentAddress))

    // state contains local variables that would rerender the component
    // state is set to default score-salt only if the cache is empty for that assessment address
    if (cacheCommitData) {
      this.state = {
        score: Number(cacheCommitData.score),
        salt: cacheCommitData.salt,
        wrongScore: false
      }
    } else {
      this.state = {
        score: 100,
        salt: 'hihi',
        wrongScore: false
      }
    }
  }

  setScore (e) {
    let score = Number(e.target.value)
    if (score >= 0 && score <= 100) {
      this.setState({score: score, wrongScore: false})
    } else {
      this.setState({wrongScore: true})
    }
  }

  stake () {
    this.props.confirmAssessor(this.props.assessmentAddress)
  }

  commit () {
    // commit score+salt (salt is fixed for now)
    window.alert('Please write down your salt:' + this.state.salt)
    this.props.commit(this.props.assessmentAddress, this.state.score, this.state.salt)

    // save salt and score in local storage
    let cacheCommitData = JSON.stringify({score: this.state.score, salt: this.state.salt})
    window.localStorage.setItem(this.props.assessmentAddress, cacheCommitData)
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
    let actionData = this.buttonLogic[this.props.assessorStage]
    // dislpay input only if needed
    let input = null
    if (this.props.assessorStage === 2 && (this.props.assessorAddress === this.props.userAddress)) {
      input = h('div', {style: {display: 'inline-block'}}, [
        h(Feedback, {wrongScore: this.state.wrongScore}, 'must be 0 <= score <= 100'),
        h('input', {value: this.state.score, type: 'number', onChange: this.setScore.bind(this)})
      ])
    }
    // display button according to user pov
    let buttonComponent = null
    if (this.props.assessorAddress === this.props.userAddress) {
      buttonComponent = h(ActiveButton, {onClick: actionData.function.bind(this)}, actionData.text)
    } else {
      buttonComponent = h(StaleButton, actionData.text)
    }
    if (active) {
      return (
        h('div', [
          h('span', displayString),
          input,
          buttonComponent
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
