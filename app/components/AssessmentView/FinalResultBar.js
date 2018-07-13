import { Component } from 'react'
import styled from 'styled-components'
import { Stage } from '../../constants.js'
var h = require('react-hyperscript')

// component to display all assessors
class FinalResultBar extends Component {
  constructor (props) {
    super(props)

    // get cache/localStorage data in case a score-salt has been commited
    let cacheCommitData = JSON.parse(window.localStorage.getItem(this.props.address + this.props.userAddress))
    if (cacheCommitData) {
      this.state = {
        score: Number(cacheCommitData.score)
      }
    } else {
      this.state = {
        score: '??'
      }
    }
  }

  render () {
    let scoreString = this.props.finalScore + ' out of 100 ' + (this.props.finalScore > 50 ? '(Pass)' : '(Fail)')
    if (this.props.userAddress === this.props.assessee) {
      console.log()
      return h(FinalScoreField, 'Your final score is ' + scoreString)
    } else if (this.props.userStage === Stage.Done) {
      // user is assessor
      let gain = this.props.payout - this.props.cost
      return (
        h(FinalResultBox, [
          h(AssessorScore, 'Your score was: ' + this.state.score || '?'),
          h(FinalScoreField, 'Final score is:' + scoreString),
          h(EarnedReward, 'You earned ' + (gain >= 0 ? '+' : '-') + gain.toString() + ' AHA')
        ])
      )
    } else {
      // user is visitor
      return h(FinalScoreField, 'The final score is ' + scoreString)
    }
  }
}

export default FinalResultBar

export const FinalScoreField = styled('span')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const FinalResultBox = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const AssessorScore = styled('span')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const EarnedReward = styled('span')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
