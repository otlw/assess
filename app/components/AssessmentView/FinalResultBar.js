import { Component } from 'react'
import styled from 'styled-components'
import { Stage } from '../../constants.js'
var h = require('react-hyperscript')

// component to display all assessors
class FinalResultBar extends Component {
  constructor (props) {
    super(props)

    // get cache/localStorage data in case a score has been commited via this device
    this.cacheCommitData = JSON.parse(window.localStorage.getItem(this.props.address + this.props.userAddress))
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
          (this.cacheCommitData
            ? h(AssessorScore, 'Your score was: ' + Number(this.cacheCommitData))
            : null), // user used a different way or machine to enter the score than our app
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
