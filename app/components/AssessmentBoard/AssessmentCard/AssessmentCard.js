import { Component } from 'react'
import h from 'react-hyperscript'
// can we remove this? import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage, TimeOutReasons, CompletedStages } from '../../../constants.js'
import { statusMessage } from '../../../utils.js'
import { Headline, Label, Body } from '../../Global/Text.ts'
import { ButtonPrimary, ButtonSecondary } from '../../Global/Buttons.ts'

export class AssessmentCard extends Component {
  render () {
    const assessment = this.props.assessment
    let userStage = assessment.userStage
    let stage = assessment.stage

    // set assessee/assessor view
    let isAssessee = this.props.userAddress === assessment.assessee
    let actionRequired = stage === userStage && stage !== Stage.Done
    let status = statusMessage(isAssessee, assessment)
    return (
      h(cardContainer, [
        h(cardContainerInfo, [
          h(cardTextObject, [
            h(Label, 'Assessment'),
            h(Headline, assessment.conceptData.name)
          ]),
          h(cardTextObject, [
            h(Label, 'Assessee'),
            h(Body, isAssessee ? 'You' : assessment.assessee.substring(0, 8) + '...')
          ])
        ]),
        h(cardContainerStatus, [
          h(cardContainerProgressBar, progressButtons(stage, actionRequired, assessment.violation || false)),
          h(cardTextStatus, [
            h(Label, 'Status'),
            h(Body, status)
          ]),
          h('div', {className: 'flex flex-row justify-between w-100 pb3 ph3'}, linkButtons(assessment, isAssessee, this.props.setCardVisibility))
        ])
      ])
    )
  }
}

function linkButtons (assessment, isAssessee, setCardVisibility) {
  let userFault = (assessment.violation && assessment.userStage === assessment.stage) || assessment.userStage === Stage.Burned
  if (assessment.violation) {
    if (userFault) return [h(ButtonSecondary, 'Why?'), h(ButtonPrimary, {to: '/'}, 'Closed')] // TODO why should be a link
    // not  userFault
    if (assessment.refunded) {
      // no assessment contract exits -> no link to detail-view
      return [h(ButtonSecondary, 'Why?'), h(ButtonPrimary, {to: '/'}, 'Refunded')]
    } else {
      // not refunded yet -> provide link
      return [h(ButtonSecondary, 'Why?'), h(ButtonPrimary, {to: '/assessment/' + assessment.address}, 'Refund')]
    }
  } else {
    // NOTE this section could be refactored to be smaller, as the only thing that varies is the text of the button. But i am keeping this
    // longer structure becasue once we want to provide different links on the why-button, it will come in handy to have the cases be more explicit.
    // no violation!
    // is the user done (for the respective stage?)
    let buttonList = [
      h(ButtonSecondary, {
        onClick: () => setCardVisibility(assessment.address, !assessment.hidden)
      }, assessment.hidden ? 'Unhide' : 'Hide')
    ]
    if (assessment.stage < Stage.Done && assessment.userStage === assessment.stage) {
      buttonList.push(
        h(ButtonPrimary,
          {to: '/assessment/' + assessment.address},
          assessment.userStage === Stage.None ? 'View' : StageDisplayNames[assessment.stage]))
    } else {
      buttonList.push(
        h(ButtonPrimary,
          {to: '/assessment/' + assessment.address},
          assessment.userStage === Stage.None ? 'View' : CompletedStages[assessment.stage]))
    }
    return buttonList
  }
}

function progressButtons (stage, actionRequired, violation) {
  return [
    progressButton(stage, Stage.Called, actionRequired, violation),
    progressButton(stage, Stage.Confirmed, actionRequired, violation),
    progressButton(stage, Stage.Committed, actionRequired, violation),
    progressButton(stage, Stage.Done, actionRequired, violation)
  ]
}

function progressButton (assessmentStage, phase, actionRequired, violation) {
  // check whether the assessment was aborted
  if ((violation === TimeOutReasons.NotEnoughAssessors && phase === Stage.Called) ||
      (violation === TimeOutReasons.NotEnoughCommits && phase === Stage.Confirmed) ||
      (violation === TimeOutReasons.NotEnoughReveals && phase === Stage.Committed)) {
    return h(cardProgressBarObjectFailed)
  }
  // it was not a violation! see whether the phase has been completed:
  if (assessmentStage > phase || assessmentStage === Stage.Done) {
    return h(cardProgressBarObjectComplete)
  }
  // see whether the stage is still ongoing and requires user input:
  if (assessmentStage === phase && actionRequired) {
    return h(cardProgressBarObjectActive)
  }
  // or whether the stage is the last one -> no user action required
  if (assessmentStage === Stage.Done) {
    return h(cardProgressBarObjectComplete)
  }
  // DEFAULT: the phase is on, but the user must no longer do anything
  return h(cardProgressBarObjectInactive)
}

export default AssessmentCard

// styles
const cardContainer = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4'
})`height: 420px; width: 300px;background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #CFF9EF 85.98%);
`

const cardContainerInfo = styled('div').attrs({
  className: 'flex justify-between flex-column w-100 pa3'
})`
height: 60%;
`

const cardTextObject = styled('div').attrs({
  className: 'flex flex-column tl'
})`
`

const cardContainerStatus = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100'
})`
height: 40%;
background-color: #D3ECF7;
`

const cardTextStatus = styled('div').attrs({
  className: 'flex flex-column h-100 pl3 pa3 tl'
})`
`

const cardContainerProgressBar = styled('div').attrs({
  className: 'absolute flex items-center'
})`right: 16px; top: -8px;
`

const cardProgressBarObjectInactive = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 20px; height: 20px;
`

const cardProgressBarObjectActive = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 20px; height: 20px; background-color: #52A7CC;
`
const cardProgressBarObjectComplete = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 20px; height: 20px; background-color: #52CC91;
`

const cardProgressBarObjectFailed = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 20px; height: 20px; background-color: #ff0000;
`
