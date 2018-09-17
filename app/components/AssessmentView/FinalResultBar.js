import { Component } from 'react'
import styled from 'styled-components'
import { Stage } from '../../constants.js'
var h = require('react-hyperscript')

// component to display all assessors
class FinalResultBar extends Component {
  constructor (props) {
    super(props)

    // get cache/localStorage data in case a score has been commited via this device
    this.cacheCommitData = JSON.parse(window.localStorage.getItem(this.props.assessmentAddress + this.props.userAddress))
  }

  render () {
    let scoreString = this.props.finalScore + ' out of 100 ' + (this.props.finalScore > 50 ? 'and passed! Congratulations' : 'and failed. We can help you pass next time.')
    if (this.props.userAddress === this.props.assessee) {
      console.log()
      return h(scoreTextResult, 'You scored ' + scoreString)
    } else if (this.props.userStage === Stage.Done) {
      // user is assessor
      let gain = Math.round(this.props.payout - this.props.cost)
      return (
        h(containerScore, [
          (this.cacheCommitData
            ? h(scoreTextAssessor, 'You scored: ' + Number(this.cacheCommitData))
            : null), // user used a different way or machine to enter the score than our app
          h(objectScoreText, [
            h(scoreTextResult, 'The final score is ' + this.props.finalScore)
          ]),
          h(objectScoreText, [
            h(scoreTextReward, 'You earned ' + (gain >= 0 ? '+' : '-') + gain.toString() + ' AHA')
          ])
        ])
      )
    } else {
      // user is visitor
      return h(scoreTextResult, 'The final score is ' + scoreString)
    }
  }
}

export default FinalResultBar

const containerScore = styled('div').attrs({className: 'flex flex-row w-100 h3 items-center justify-center bt b--light-gray'})`
`

const objectScoreText = styled('div').attrs({className: 'flex flex-row w-100 h-100 items-center justify-center bl b--light-gray'})`
`

const scoreTextResult = styled('h5').attrs({className: 'f5 fw4 dark-gray'})`
`

const scoreTextAssessor = styled('div').attrs({className: 'flex f-100'})`
`
const scoreTextReward = styled('h5').attrs({className: 'f5 fw4 dark-gray'})`
`
