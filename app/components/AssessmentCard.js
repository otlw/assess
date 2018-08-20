import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage, TimeOutReasons, CompletedStages } from '../constants.js'

export class AssessmentCard extends Component {
  render () {
    const assessment = this.props.assessment
    let userStage = assessment.userStage
    let stage = assessment.stage

    // set assessee/assessor view
    let isAssessee = this.props.userAddress === assessment.assessee
    let actionRequired = stage === userStage
    let status = statusMessage(isAssessee, actionRequired, assessment)

    /* start styling below */
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
          h(cardContainerProgressBar, [
            progressButton(stage, Stage.Called, actionRequired, assessment.violation || false),
            progressButton(stage, Stage.Confirmed, actionRequired, assessment.violation || false),
            progressButton(stage, Stage.Committed, actionRequired, assessment.violation || false),
            progressButton(stage, Stage.Done, actionRequired, assessment.violation || false)
          ]),
          h(cardTextStatus, [
            h(cardLabel, 'Status'),
            h(cardTextStatusMsg, status)
          ]),
          h('div', {className: 'flex flex-row justify-between w-100 pb3 ph3'}, [
            h(cardButtonSecondary, 'Hide'),
            h(cardButtonPrimary, {to: '/assessment/' + assessment.address},
              assessment.refunded ? 'Refunded'
                : assessment.violation ? 'Refund'
                  : actionRequired ? StageDisplayNames[stage]
                    : CompletedStages[stage])
          ])
        ])
      ])
    )
  }
}
/*
returns the message to be displayed on the assessment Card, which is different depending on
whether the user needs to be active, the assessment was cancelled and the phase of the assessment
*/
function statusMessage (isAssessee, actionRequired, assessment) {
  let status = ''
  // assessment Failed?
  if (assessment.violation) {
    if (actionRequired) {
      status += 'The assessment failed because you didn\'t ' + StageDisplayNames[assessment.stage] + '. Your fee has been burned.'
    } else {
      // other assessors are at fault
      status += 'The assessment failed because ' + (assessment.size - assessment.done).toString() 
      if (assessment.violation === TimeOutReasons.NotEnoughAssessors) {
        status += 'less than 5 assessors staked.'
      }
      if (assessment.violation === TimeOutReasons.NotEnoughCommits) {
        status += ' assessors didn\'t commit in time.'
      } else {
        status += ' assessors did not reveal their scores.'
      }
      if (assessment.refunded) {
        status += 'Your fee has been refunded to you.'
      }
    }
  } else {
    // assessment is completed ?
    if (assessment.stage === Stage.Done) {
      // display payout (or score)?
      if (!isAssessee) {
        let gain = this.props.assessment.payout - this.props.assessment.cost
        status = h('div', [
          h('div', 'Payout :'),
          h('div', (gain >= 0 ? '+' : '-') + gain.toString() + ' AHA')
        ])
      } else {
        // user is assessee -> display score
        status = h('div', [
          h('div', 'Score :'),
          h('div', assessment.finalScore + ' %')
        ])
      }
    }
    // not done, but user must not do something
    else if (!actionRequired) {
      status += 'Waiting...'
    } else {
      // not done because user (and others) need to do something
      let nOtherAssessorsToBeActive = assessment.size - assessment.done - (actionRequired ? 1 : 0)
      // user must do something
      status += 'Waiting for you and ' + nOtherAssessorsToBeActive + ' assessors to ' + StageDisplayNames[assessment.stage]
    }
  }
  return status
}

function progressButton (assessmentStage, phase, actionRequired, violation) {
  // check whether the assessment was aborted
  if (violation === TimeOutReasons.NotEnoughAssessors && phase === Stage.Called) {
    console.log('fired1')
    return h(cardProgressBarObjectFailed)
  } else if (violation === TimeOutReasons.NotEnoughCommits && phase === Stage.Confirmed) {
    console.log('fired2')
    return h(cardProgressBarObjectFailed)
  } else if (violation === TimeOutReasons.NotEnoughReveals && phase === Stage.Committed) {
    console.log('fired3')
    return h(cardProgressBarObjectFailed)
  }
  // it was not! see whether the phase has been completed
  if (assessmentStage > phase || assessmentStage === Stage.Done) {
    return h(cardProgressBarObjectComplete)
  }
  // whether the stage is still ongoing
  if (assessmentStage === phase && actionRequired) {
    // and requires user input
    return h(cardProgressBarObjectActive)
    // or whether the stage is the last one -> no user action required
  } else if (assessmentStage === Stage.Done) {
    return h(cardProgressBarObjectComplete)
  } else {
    // the phase is on, but the user must no longer do anything
    return h(cardProgressBarObjectInactive)
  }
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
