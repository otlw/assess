import { Component } from 'react'
import h from 'react-hyperscript'
import styled from 'styled-components'
import TxList from '../../TxList.js'

// styles
const Feedback = styled.div`
  font-size: 0.7em;
  font-style: italic;
  color:${props => props.invalidScoreRange ? 'red' : 'lightgrey'};
`
const ActiveButton = styled.button`
  color:${props => props.theme.primary};
  border-color:${props => props.theme.primary};
  background-color:${props => props.theme.light};
  cursor: pointer;
`

// component to display an individual assessor slot address and options
export class AssessorStatus extends Component {
  constructor (props) {
    super(props)

    // get cache/localStorage data in case a score-salt has been commited
    let cacheCommitData = JSON.parse(window.localStorage.getItem(this.props.assessmentAddress + this.props.userAddress))

    // state contains local variables that would rerender the component
    // state is set to default score-salt only if the cache is empty for that assessment address
    if (cacheCommitData) {
      this.state = {
        score: Number(cacheCommitData.score),
        salt: cacheCommitData.salt,
        invalidScoreRange: false
      }
    } else {
      this.state = {
        score: 100,
        salt: 'hihi',
        invalidScoreRange: false
      }
    }
  }

  setScore (e) {
    // make sure number is a multiple of 0.5%
    let score = (Math.floor((Number(e.target.value)) * 2)) / 2
    if (score >= 0 && score <= 100 && (((Number(e.target.value)) * 10) % 5) === 0) {
      this.setState({score: score, invalidScoreRange: false})
    } else {
      this.setState({invalidScoreRange: true})
    }
  }

  stake () {
    console.log('assessmentAddress', this.props.assessmentAddress)
    this.props.confirmAssessor(this.props.assessmentAddress)
  }

  commit () {
    // commit score+salt (salt is fixed for now)
    window.alert('Please write down your salt:' + this.state.salt)

    // convert score to onChain score (FE:0-100, BE: -100,100)
    let onChainScore = (this.state.score * 2) - 100

    // call smart contract
    this.props.commit(this.props.assessmentAddress, onChainScore, this.state.salt)

    // save salt and score in local storage
    let cacheCommitData = JSON.stringify({score: this.state.score, salt: this.state.salt})
    window.localStorage.setItem(this.props.assessmentAddress + this.props.userAddress, cacheCommitData)
  }

  reveal () {
    console.log('reveal', this.props.assessmentAddress, this.state.score, this.state.salt)

    // convert score to onChain score (FE:0-100, BE: -100,100)
    let onChainScore = (this.state.score * 2) - 100

    // call smart contract
    this.props.reveal(this.props.assessmentAddress, onChainScore, this.state.salt)
  }

  steal () {
    // TODO
  }

  // returns a button or status element for the user-assessor
  statusElementUser (stage) {
    switch (stage) {
      case 1:
        return h(ActiveButton, {onClick: this.stake.bind(this)}, 'Stake!')
      case 2:
        return h('div', {style: {display: 'inline-block'}}, [
          // input field
          h('div', {style: {display: 'inline-block'}}, [
            h(Feedback, {invalidScoreRange: this.state.invalidScoreRange}, 'must be 0% <= score <= 100%, 0.5% granularity'),
            h('input', {value: this.state.score, step: 0.5, type: 'number', onChange: this.setScore.bind(this)})
          ]),
          // button
          h(ActiveButton, {onClick: this.commit.bind(this)}, 'Commit a score!')
        ])
      case 3:
        return h(ActiveButton, {onClick: this.reveal.bind(this)}, 'Reveal your score!')
      case 4:
        return h('span', 'done (Payout: ' + this.props.payout + ')')
      case 5:
        return h('span', 'Burned!')
      default:
        console.log('assessment has unexpected stage !', stage)
        return h('span', 'wrong stage !')
    }
  }

  // returns the status of an assessor that is not the user
  statusElementNonUser (stage) {
    switch (stage) {
      case 1 :
        return h('span', 'needs to stake')
      case 2:
        return h('span', 'needs to commit')
      case 3:
        return h('span', 'needs to reveal')
      case 4:
        return h('span', 'done (Payout: ' + this.props.payout + ')')
      case 5:
        return h('span', 'has been burned')
      default:
        console.log('assessment has unexpected stage !', stage)
        return h('span', 'Unknown stage !' + stage)
    }
  }

  render () {
    // display assessor information
    let displayString = 'assessor ' + (this.props.assessorNumber + 1) + ': ' + this.props.assessorAddress + ' ->   '
    // determine if assessor is ahead of assessment
    let active = this.props.assessorStage === this.props.stage
    if (active) {
      let statusElement = this.props.assessorAddress === this.props.userAddress
        ? this.statusElementUser(this.props.assessorStage)
        : this.statusElementNonUser(this.props.assessorStage)
      return (
        h('div', [
          h('span', displayString),
          statusElement,
          this.props.transactions
            ? h(TxList, {transactions: this.props.transactions})
            : null
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
