import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage, TimeOutReasons, CompletedStages } from '../../constants.js'
import { statusMessage } from '../../utils.js'

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
            h(cardTextTitle, 'Assessment'),
            h(ConceptName, assessment.conceptData.name)
          ]),
          h(cardTextObject, [
            h(cardLabel, 'Assessee'),
            h(cardTextAssessee, isAssessee ? 'You' : assessment.assessee.substring(0, 8) + '...')
          ])
        ]),
        h(cardContainerStatus, [
          h(cardContainerProgressBar, progressButtons(stage, actionRequired, assessment.violation || false)),
          h(cardTextStatus, [
            h(cardLabel, 'Status'),
            h(cardTextStatusMsg, status)
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
    if (userFault) return [h(cardButtonSecondary, 'Why?'), h(cardButtonPrimary, {to: '/'}, 'Closed')] // TODO why should be a link
    // not  userFault
    if (assessment.refunded) {
      // no assessment contract exits -> no link to detail-view
      return [h(cardButtonSecondary, 'Why?'), h(cardButtonPrimary, {to: '/'}, 'Refunded')]
    } else {
      // not refunded yet -> provide link
      return [h(cardButtonSecondary, 'Why?'), h(cardButtonPrimary, {to: '/assessment/' + assessment.assessmentAddress}, 'Get refunded')]
    }
  } else {
    // NOTE this section could be refactored to be smaller, as the only thing that varies is the text of the button. But i am keeping this
    // longer structure becasue once we want to provide different links on the why-button, it will come in handy to have the cases be more explicit.
    // no violation!
    // is the user done (for the respective stage?)
    let buttonList = [
      h(cardButtonSecondary, {
        onClick: () => setCardVisibility(assessment.assessmentAddress, !assessment.hidden)
      }, assessment.hidden ? 'Unhide' : 'Hide')
    ]
    if (assessment.stage < Stage.Done && assessment.userStage === assessment.stage) {
      buttonList.push(
        h(cardButtonPrimary,
          {to: '/assessment/' + assessment.assessmentAddress},
          assessment.userStage === Stage.None ? 'View' : StageDisplayNames[assessment.stage]))
    } else {
      buttonList.push(
        h(cardButtonPrimary,
          {to: '/assessment/' + assessment.assessmentAddress},
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

const cardTextTitle = styled('div').attrs({
  className: 'f5 fw4 mv1 ttu uppercase'
})`
color: #0A4A66;
`

const cardLabel = styled('div').attrs({
  className: 'f5 fw4 mv1 ttu uppercase'
})`
color: #0A4A66;
`

const cardTextAssessee = styled('div').attrs({
  className: 'f5 fw4 mv1 ttu uppercase truncate w4 ellipsis'
})`
color: #117099;
`

const cardContainerStatus = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100'
})`
height: 40%;
background-color: #D3ECF7;
`

const cardTextStatus = styled('div').attrs({
  className: 'flex flex-column h-100 pl3 pa3'
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

const cardTextStatusMsg = styled('div').attrs({
  className: 'f5 fw4 mv1'
})`
color: #117099;
`

const cardButtonPrimary = styled(Link).attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'
})`background-color: #116187;text-decoration:none;
`

const cardButtonSecondary = styled('div').attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 items-center align-center br-pill dark-blue'
})`box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
`

const ConceptName = styled('h2').attrs({
  className: 'f2 fw4 mv1'
})`
  color:${props => props.theme.dark};
`
