import { Component } from 'react'
import h from 'react-hyperscript'
// can we remove this? import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage, CompletedStages } from '../../../constants.js'
import { Headline, Label, Body } from '../../Global/Text.ts'
import {LinkPrimary} from '../../Global/Links.ts'
import { ButtonSecondary } from '../../Global/Buttons.ts'
import progressDots from '../../Global/progressDots.ts'
import { statusMessage, mapAssessmentStageToStep } from '../../../utils.js'

export class AssessmentCard extends Component {
  render () {
    const assessment = this.props.assessment
    let stage = assessment.stage

    // set assessee/assessor view
    let isAssessee = this.props.userAddress === assessment.assessee
    let status = statusMessage(isAssessee, assessment, this.props.transactions)
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
          h(cardTextStatus, [
            h(cardRowStatus, [
              h(Label, 'Status'),
              h(cardContainerProgressBar, {},
                h(progressDots, {
                  length: 4,
                  step: mapAssessmentStageToStep(stage) - 1,
                  failed: assessment.violation || false
                }))
            ]),
            h(Body, status)
          ]),
          h('div', {className: 'flex flex-row justify-between w-100'}, linkButtons(assessment, isAssessee, this.props.setCardVisibility))
        ])
      ])
    )
  }
}

function linkButtons (assessment, isAssessee, setCardVisibility) {
  let userFault = (assessment.violation && assessment.userStage === assessment.stage) || assessment.userStage === Stage.Burned
  if (assessment.violation) {
    if (userFault) return [h(ButtonSecondary, 'Why?'), h(LinkPrimary, {to: '/'}, 'Closed')] // TODO why should be a link
    // not  userFault
    if (assessment.refunded) {
      // no assessment contract exits -> no link to detail-view
      return [h(ButtonSecondary, 'Why?'), h(LinkPrimary, {to: '/'}, 'Refunded')]
    } else {
      // not refunded yet -> provide link
      return [h(ButtonSecondary, 'Why?'), h(LinkPrimary, {to: '/assessment/' + assessment.address}, 'Refund')]
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
        h(LinkPrimary,
          {to: '/assessment/' + assessment.address},
          assessment.userStage === Stage.None ? 'View' : StageDisplayNames[assessment.stage]))
    } else {
      buttonList.push(
        h(LinkPrimary,
          {to: '/assessment/' + assessment.address},
          assessment.userStage === Stage.None ? 'View' : CompletedStages[assessment.stage]))
    }
    return buttonList
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

const cardContainerStatus = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100 pa3 justify-between'
})`
height: 40%;
background-color: #D3ECF7;
`

const cardTextStatus = styled('div').attrs({
  className: 'flex flex-column tl'
})`
max-height: 80px;
overflow: hidden; 
`

const cardRowStatus = styled('div').attrs({
  className: 'flex flex-row items-center'
})`
`

const cardContainerProgressBar = styled('div').attrs({
  className: 'flex items-center'
})`
`
