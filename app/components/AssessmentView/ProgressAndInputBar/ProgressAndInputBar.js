import { Component } from 'react'
import h from 'react-hyperscript'
import { Stage, StageDisplayNames } from '../../../constants.js'
import { convertFromUIScoreToOnChainScore } from '../../../utils.js'
import styled from 'styled-components'
import {ButtonPrimary, ButtonClose} from '../../Global/Buttons.ts'
import {Body} from '../../Global/Text.ts'
import inputField from '../../Global/inputField.ts'

let completedStageTexts = {
  [Stage.Confirmed]: 'You have staked successfully!',
  [Stage.Committed]: 'You have submitted your score!',
  [Stage.Revealed]: 'Your score has been revealed!'
}
// component to display an individual assessor slot address and options
export class ProgressAndInputBar extends Component {
  constructor (props) {
    super(props)

    // get cache/localStorage data in case a score-salt has been commited
    let cacheCommitData = JSON.parse(window.localStorage.getItem(this.props.assessmentAddress + this.props.userAddress))

    // state contains local variables that would rerender the component
    // state is set to default score-salt only if the cache is empty for that assessment address
    if (cacheCommitData) {
      this.state = {
        view: this.props.inputType || 'stageView',
        score: Number(cacheCommitData.score),
        salt: cacheCommitData.salt,
        invalidScoreRange: false
      }
    } else {
      this.state = {
        view: 'stageView',
        score: 0,
        salt: 'hihi',
        invalidScoreRange: false
      }
    }
    // to trigger visual feedback of assessment transactions
    this.react = {
      transactionHash: (hash) => { this.setWaiting() },
      error: () => { this.setProgressView()}
    }
  }

  setStakeAction () {
    this.setState({
      view: 'Stake',
      displayText: 'Please confirm your stake of ' + this.props.cost + ' AHA to join the assessment.',
      action: this.stake
    })
  }

  setCommitAction () {
    this.setState({
      view: 'Commit',
      displayText: 'Please input your score and confirm.',
      action: this.commit
    })
  }

  setRevealAction () {
    this.setState({
      view: 'Reveal',
      displayText: 'Click the button to reveal your score.',
      action: this.reveal
    })
  }

  setProgressView () {
    this.setState({
      view: 'stageView'
    })
  }

  // notify the user to confirm MetaMask
  setConfirmMM () {
    this.setState({
      view: 'confirmMM'
    })
  }

  // Tell the user to wait for transaction confirmation
  setWaiting () {
    this.setState({
      view: 'waiting'
    })
  }

  stake () {
    this.props.confirmAssessor(this.props.assessmentAddress,{callbck:this.react,purpose:"stake"})
    this.setConfirmMM()
  }

  commit () {
    // commit score+salt (salt is fixed for now)
    window.alert('Please write down your salt:' + this.state.salt)
    // convert score to onChain score (FE:0-100, BE: -100,100)
    let onChainScore = convertFromUIScoreToOnChainScore(this.state.score)
    this.props.commit(this.props.assessmentAddress, onChainScore, this.state.salt,{callbck:this.react,purpose:"commit"})
    // save salt and score in local storage
    let cacheCommitData = JSON.stringify({score: this.state.score, salt: this.state.salt})
    window.localStorage.setItem(this.props.assessmentAddress + this.props.userAddress, cacheCommitData)
    this.setConfirmMM()
  }

  reveal () {
    console.log('reveal', this.props.assessmentAddress, this.state.score, this.state.salt)
    // convert score to onChain score (FE:0-100, BE: -100,100)
    let onChainScore = convertFromUIScoreToOnChainScore(this.state.score)
    this.props.reveal(this.props.assessmentAddress, onChainScore, this.state.salt,{callbck:this.react,purpose:"reveal"})
    this.setConfirmMM()
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

  closeInputBar () {
    if (this.props.inputType) this.props.setInputBar('')
    else this.setProgressView()
  }

  stageFunctions (stage) {
    let stageFunctions = {
      [Stage.Called]: this.setStakeAction.bind(this),
      [Stage.Confirmed]: this.setCommitAction.bind(this),
      [Stage.Committed]: this.setRevealAction.bind(this)
    }
    return stageFunctions(stage)
  }

  // helper function to return the right kind of actionBar
  actionBar (assessmentStage, checkpoint, endtime) {
    let now = new Date()
    let timeToCommit = new Date(checkpoint * 1000 - now)
    let timeToReveal = new Date((endtime * 1000 + 24 * 60 * 60 * 1000) - now)
    let stageTexts = {
      [Stage.Called]: 'Click "Stake" to join the assessment.',
      [Stage.Confirmed]: `Please "Commit" your score within ${timeToCommit.getDate()} days, ${timeToCommit.getHours()} hours, ${timeToCommit.getMinutes()} mn.`,
      [Stage.Committed]: `Please click "Reveal" to reveal your score and complete the assessment.
      ${timeToReveal.getDate()} days, ${timeToReveal.getHours()} hours, ${timeToReveal.getMinutes()} mn remaining.`
    }
    let stageFunctions = {
      [Stage.Called]: this.setStakeAction.bind(this),
      [Stage.Confirmed]: this.setCommitAction.bind(this),
      [Stage.Committed]: this.setRevealAction.bind(this)
    }
    return (
      h(rowObjectText, [
        h(Body, stageTexts[assessmentStage]),
        h(ButtonPrimary, {
          onClick: stageFunctions[assessmentStage],
          active: false
        }, StageDisplayNames[assessmentStage])
      ])
    )
  }

  render () {
    let view = this.props.inputType || this.state.view
    let activeUser = this.props.userStage === this.props.stage
    switch (view) {
      case 'confirmMM':
        return (h(rowObjectText, [
          h(Warning, "Please confirm MetaMask transaction"),
        ]))
      case 'waiting':
        return (h(rowObjectText, [
          h(Body, "Waiting for confirmation..."),
        ]))
      case 'stageView': {
        return (
          this.props.userStage === Stage.None
            ? null
            : h(containerProgressBar, [
              activeUser ? this.actionBar(this.props.stage, this.props.checkpoint, this.props.endtime)
                : h(stageTexts, completedStageTexts[this.props.userStage])
            ])
        )
      }
      case 'Stake':
      case 'Commit':
      case 'Reveal': {
        return (
          h(containerProgressBar, [
            h(ButtonClose, {onClick: this.closeInputBar.bind(this)}),
            h(rowObjectText, [
              h(Body, this.state.displayText),
              (this.props.stage === Stage.Confirmed
                ? (
                  h(rowObjectInput, [
                    h(inputField, {
                      width: 4,
                      placeholder: 'From 0 - 100',
                      step: 0.5,
                      type: 'number',
                      onChange: this.setScore.bind(this)})
                  ])
                )
                : null
              )
            ]),
            h(ButtonPrimary, {
              onClick: this.state.action.bind(this),
              active: true
            }, view)
          ])
        )
      }
      default:
        console.log('ERROR: invalid view type', this.state.view)
        return h('div', 'Ooopsi, something went wrong here!')
    }
  }
}

export default ProgressAndInputBar

export const containerProgressBar = styled('div').attrs({className: 'flex flex-row w-100 pa3 items-center shadow-3'})`
margin-top: 1px;
min-height: 64px;
`

export const stageTexts = styled('h5').attrs({className: 'f5 fw4 mv0'})`
color: ${props => props.theme.primary};
`

export const rowObjectText = styled('div').attrs({className: 'flex w-100 items-center justify-between br b--light-gray f5 gray'})`;
`
export const Warning = styled('div').attrs({className: 'flex ma3 f5 red'})`;
`

export const rowObjectInput = styled('div').attrs({className: 'flex w-auto items-center justify-end b--light-gray  f5 gray ttu uppercase'})`;
`
