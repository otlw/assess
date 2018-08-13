import { Component } from 'react'
import { TxList } from '../../TxList.js'
import h from 'react-hyperscript'
import { Stage } from '../../../constants.js'
import { convertFromUIScoreToOnChainScore } from '../../../utils.js'
import styled from 'styled-components'

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
        view: this.props.inputType || 'progressView',
        score: Number(cacheCommitData.score),
        salt: cacheCommitData.salt,
        invalidScoreRange: false
      }
    } else {
      this.state = {
        view: 'progressView',
        score: 0,
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

  setScore (e) {
    // make sure number is a multiple of 0.5%
    let score = (Math.floor((Number(e.target.value)) * 2)) / 2
    if (score >= 0 && score <= 100 && (((Number(e.target.value)) * 10) % 5) === 0) {
      this.setState({score: score, invalidScoreRange: false})
    } else {
      this.setState({invalidScoreRange: true})
    }
  }

  storeData () {
    this.props.storeDataOnAssessment(this.props.assessmentAddress, this.state.meetingPoint)
    this.props.dispatchSetInputBar('')
  }

  setMeetingPointToBeStored (e) {
    this.setState({
      meetingPoint: e.target.value.toString(),
      action: this.storeData
    })
  }

  closeInputBar () {
    if (this.props.inputType) this.props.dispatchSetInputBar('')
    else this.setProgressView()
  }

  render () {
    let view = this.props.inputType || this.state.view
    switch (view) {
      case 'progressView': {
        // show overview with differently colored Buttons that indicate the activity of the stage
        // and the general progress of the assessment
        return (
          h(containerProgressBar, [
            // Stake Button
            h(containerProgressButton, [
              h(buttonProgressPast, {
                onClick: this.setStakeAction.bind(this),
                disabled: !(this.props.stage === Stage.Called && this.props.stage === this.props.userStage)
              }, 'Stake')]),
            h(containerProgressButton, [
              h(this.props.stage >= Stage.Confirmed ? buttonProgressPast : buttonProgressFuture, {
                onClick: this.setCommitAction.bind(this),
                disabled: !(this.props.stage === Stage.Confirmed && this.props.stage === this.props.userStage)
              }, 'Commit')]),
            h(containerProgressButton, [
              h(this.props.stage >= Stage.Committed ? buttonProgressPast : buttonProgressFuture, {
                onClick: this.setRevealAction.bind(this),
                disabled: !(this.props.stage === Stage.Committed && this.props.stage === this.props.userStage)
              }, 'Reveal')]),
            this.props.transactions
                ? h(TxList, {transactions: this.props.transactions})
                : null
          ])
        )
      }
      case 'Stake':
      case 'Commit':
      case 'Reveal': {
        // show actionView, where the user can input data and interact with the assessment
        return (
          h(containerProgressBar, [
            h(buttonClose, {onClick: this.closeInputBar.bind(this)}, 'X'),
            h(rowObjectText, [
              h(containerProgressButton, this.state.view),
              this.props.stage === Stage.Confirmed
              ? (
                h('div', {style: {display: 'inline-block'}}, [
                  h(Feedback, {invalidScoreRange: this.state.invalidScoreRange}, 'must be 0% <= score <= 100%, 0.5% granularity'),
                  h(CommitInput, {
                    placeholder: 'What score do you want to give the assessee?',
                    step: 0.5,
                    type: 'number',
                    onChange: this.setScore.bind(this)})
                ]))
              : h(StageDescriptor, this.state.displayText)
            ]),
            h(buttonSubmit, {onClick: this.state.action.bind(this)}, 'Go')
          ])
        )
      }
      case 'editMeetingPoint': {
        // add Meeting Point
        return (
          h(containerProgressBar, [
            h(buttonClose, {onClick: this.closeInputBar.bind(this)}, 'X'),
            h(rowObjectInput, 'Add a meeting Point:'),
            h(inputMeetingPoint, {
              placeholder: 'e.g. a GitLab repo',
              type: 'string',
              onChange: this.setMeetingPointToBeStored.bind(this) }),
            h(buttonSubmit, {onClick: this.storeData.bind(this)}, 'Submit')
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

export const containerProgressBar = styled('div').attrs({className: 'flex flex-row w-100 items-center bt b--light-gray'})`

`

export const buttonClose = styled('button').attrs({className: 'flex items-center justify-center ph4 bn b--light-gray pointer'})`
`
export const ProgressButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const containerProgressButton = styled('div').attrs({className: 'flex w-100 items-center justify-center pv3  '})`
`

export const buttonProgressPast = styled('button').attrs({className: 'flex pv2 ph3 items-center justify-center br-pill bn ttu uppercase pointer'})`
color: #EAF7FD;
background-color: #0A4A66;
`

export const buttonProgressFuture = styled('button').attrs({className: 'flex pv2 ph3 items-center justify-center br-pill ba ttu uppercase pointer'})`
  color: #0A4A66;
  background: transparent;
  border-color: #0A4A66;
`
// need to rename to progressBarTextDescription
export const StageDescriptor = styled('div').attrs({className: 'flex w-100 items-center justify-center f5 gray pv3'})`
`

export const rowObjectText = styled('div').attrs({className: 'flex w-100 items-center justify-center pv2 bl br b--light-gray f5 gray ttu uppercase'})`;
`

export const rowObjectInput = styled('div').attrs({className: 'flex w-100 items-center justify-center pv2 b--light-gray f5 gray ttu uppercase'})`;
`

export const buttonSubmit = styled('button').attrs({className: 'flex h-100 items-center justify-center pv3 bn ph4 bg-light-green pointer ttu uppercase f5 '})`

`

export const Feedback = styled.div`
  font-size: 0.7em;
  font-style: italic;
  color:${props => props.invalidScoreRange ? 'red' : 'lightgrey'};
`

export const inputMeetingPoint = styled('input').attrs({className: 'flex w-100 h-100 ph2 bg-light-gray bn '})`
outline: none;
`
