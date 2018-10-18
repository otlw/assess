import { Component } from 'react'
import h from 'react-hyperscript'
// can we remove this? import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage, CompletedStages } from '../../../constants.js'
import { Headline, Label, Body } from '../../Global/Text.ts'
import {LinkPrimary} from '../../Global/Links.ts'
import { ButtonSecondary } from '../../Global/Buttons.ts'
import progressDots from '../../Global/progressDots.ts'
import {ExplanationCard} from '../../Global/cardContainers.ts'
import { statusMessage, mapAssessmentStageToStep } from '../../../utils.js'

export class AssessmentCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      toggleWhy: false,
      whyReason: ''
    }
  }

  toggleWhy (e) {
    if (e) {
      this.setState({toggleWhy: !this.state.toggleWhy, whyReason: e.target.id || ''})
    } else {
      this.setState({toggleWhy: !this.state.toggleWhy})
    }
  }

  // returns the two buttons at the bottom of the assessment Card
  linkButtons (assessment, isAssessee, setCardVisibility) {
    let buttonList = []
    // The whyText variable indicates what the first button will display (information/hide)
    // and the 'secondButtonText' variable will determine what the second button will display (the action button)
    let whyText = 'Hide'
    let secondButtonText = 'Stake'

    // First let's determine if the assessment failed
    if (assessment.violation) {
      let userFault = (assessment.violation && assessment.userStage === assessment.stage) || assessment.userStage === Stage.Burned
      if (userFault) {
        whyText = 'userFault'
        secondButtonText = 'Closed'
      } else {
        if (assessment.refunded) {
          whyText = 'refunded'
          secondButtonText = 'Refunded'
        } else {
          whyText = 'notRefundedYet'
          secondButtonText = 'Refund'
        }
      }

      // Else, let's use the assessment stages to determine what to display
    } else if (assessment.userStage === Stage.None) {
      // Waiting for other users
      whyText = 'none' // TODO figure out case where this is displayed and what appropriate text to display
      // why is this different from other 'completed' stages ?
      secondButtonText = 'View'
    } else if (assessment.stage < Stage.Done && assessment.userStage === assessment.stage && assessment.userStage !== 1) {
      // 'Active' status
      secondButtonText = StageDisplayNames[assessment.stage]
      whyText = secondButtonText
    } else if (assessment.userStage !== 1) {
      // 'Completed' stages (waiting for others)
      secondButtonText = CompletedStages[assessment.stage]
      whyText = secondButtonText
    }

    // First button is always 'WHY', unless the assessment is in 'available' mode, in which case it's "Hide"
    if (whyText === 'Hide') {
      buttonList.push(h(
        ButtonSecondary, {
          onClick: () => setCardVisibility(assessment.address, !assessment.hidden)
        }, assessment.hidden ? 'Unhide' : 'Hide')
      )
    } else {
      buttonList.push(
        h(ButtonSecondary, {onClick: this.toggleWhy.bind(this), id: whyText}, 'Why?')
      )
    }

    // Second Button
    buttonList.push(
      h(LinkPrimary,
        {to: (secondButtonText === 'Closed' || secondButtonText === 'Refunded') ? '/' : '/assessment/' + assessment.address},
        secondButtonText
      )
    )

    return buttonList
  }

  render () {
    const assessment = this.props.assessment
    let stage = assessment.stage

    // set assessee/assessor view
    let isAssessee = this.props.userAddress === assessment.assessee
    let status = statusMessage(isAssessee, assessment, this.props.transactions)

    let regularCardContent = h(cardContainer, [
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
        h('div', {className: 'flex flex-row justify-between w-100'}, this.linkButtons(assessment, isAssessee, this.props.setCardVisibility))
      ])
    ])

    if (this.state.toggleWhy) {
      return h(ExplanationCard, {goBack: this.toggleWhy.bind(this), title: this.state.whyReason, text: this.state.whyReason})
    } else {
      return regularCardContent
    }
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
