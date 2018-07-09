import { Component } from 'react'
import h from 'react-hyperscript'
import { Stage } from '../../../constants.js'
import { ProgressButtonBox, ProgressButton, PastOrPresentPhaseButton, FuturePhaseButton, StageDescriptor, SubmitButton } from './style.js'
import { convertFromUIScoreToOnChainScore } from '../../../utils.js'

// component to display an individual assessor slot address and options
export class ProgressButtonBar extends Component {
  constructor (props) {
    super(props)

    // get cache/localStorage data in case a score-salt has been commited
    let cacheCommitData = JSON.parse(window.localStorage.getItem(this.props.assessmentAddress + this.props.userAddress))

    // state contains local variables that would rerender the component
    // state is set to default score-salt only if the cache is empty for that assessment address
    if (cacheCommitData) {
      this.state = {
        view: 'progressView',
        score: Number(cacheCommitData.score),
        salt: cacheCommitData.salt,
        invalidScoreRange: false
      }
    } else {
      this.state = {
        view: 'progressView',
        score: 100,
        salt: 'hihi',
        invalidScoreRange: false
      }
    }
  }

  setStakeAction () {
    this.setState({
      view: 'Stake',
      displayText: 'Click to stake ' + this.props.cost + ' AHA and become an assessor.',
      action: this.stake
    })
  }

  setCommitAction () {
    this.setState({
      view: 'Commit',
      displayText: 'Enter the score you want to commit.',
      action: this.commit
    })
  }

  setRevealAction () {
    this.setState({
      view: 'Reveal',
      displayText: 'Click the button to reveal your score',
      action: this.reveal
    })
  }

  setProgressView () {
    this.setState({
      view: 'progressView'
    })
  }

  stake () {
    console.log('assessmentAddress', this.props.assessmentAddress)
    this.props.confirmAssessor(this.props.assessmentAddress)
    this.setProgressView()
  }

  commit () {
    // commit score+salt (salt is fixed for now)
    window.alert('Please write down your salt:' + this.state.salt)
    // convert score to onChain score (FE:0-100, BE: -100,100)
    let onChainScore = convertFromUIScoreToOnChainScore(this.state.score)
    this.props.commit(this.props.assessmentAddress, onChainScore, this.state.salt)
    // save salt and score in local storage
    let cacheCommitData = JSON.stringify({score: this.state.score, salt: this.state.salt})
    window.localStorage.setItem(this.props.assessmentAddress + this.props.userAddress, cacheCommitData)
    this.setProgressView()
  }

  reveal () {
    console.log('reveal', this.props.assessmentAddress, this.state.score, this.state.salt)
    // convert score to onChain score (FE:0-100, BE: -100,100)
    let onChainScore = convertFromUIScoreToOnChainScore(this.state.score)
    this.props.reveal(this.props.assessmentAddress, onChainScore, this.state.salt)
    this.setProgressView()
  }

  render () {
    if (this.state.view === 'progressView') {
      console.log('props', this.props)
      return (
        h(ProgressButtonBox, [
          h(PastOrPresentPhaseButton, {
            onClick: this.setStakeAction.bind(this),
            disabled: !(this.props.stage === Stage.Called && this.props.stage === this.props.userStage)
          }, '1. Stake'),
          h(this.props.stage >= Stage.Confirmed ? PastOrPresentPhaseButton : FuturePhaseButton, {
            onClick: this.setCommitAction.bind(this),
            disabled: !(this.props.stage === Stage.Confirmed && this.props.stage === this.props.userStage)
          }, '2. Commit'),
          h(this.props.stage >= Stage.Committed ? PastOrPresentPhaseButton : FuturePhaseButton, {
            onClick: this.setRevealAction.bind(this),
            disabled: !(this.props.stage === Stage.Committed && this.props.stage === this.props.userStage)
          }, '3. Reveal')
        ])
      )
    } else {
      return (
        h(ProgressButtonBox, [
          h('button', {onClick: this.setProgressView.bind(this)}, 'X'),
          h(ProgressButton, this.state.view),
          h(StageDescriptor, this.state.displayText), // TODO, if commit, make it a textfield
          h(SubmitButton, {onClick: this.state.action.bind(this)}, 'Go')
        ])
      )
    }
  }
}


export default ProgressButtonBar
