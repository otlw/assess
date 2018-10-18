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
  constructor (props) {
    super(props)
    this.state = {
      toggleWhy: false,
      whyReason: ''
    }
  }

  toggleWhy (e) {
    this.setState({toggleWhy: !this.state.toggleWhy, whyReason: e.target.id || ''})
  }

  // linkButtons (assessment, isAssessee, setCardVisibility) {
  //   let userFault = (assessment.violation && assessment.userStage === assessment.stage) || assessment.userStage === Stage.Burned
  //   if (assessment.violation) {
  //     if (userFault) return [h(ButtonSecondary, {onClick: this.toggleWhy.bind(this), id: 'userFault'}, 'Why?'), h(LinkPrimary, {to: '/'}, 'Closed')]
  //     // not  userFault
  //     if (assessment.refunded) {
  //       // no assessment contract exits -> no link to detail-view
  //       return [h(ButtonSecondary, {onClick: this.toggleWhy.bind(this), id: 'refunded'}, 'Why?'), h(LinkPrimary, {to: '/'}, 'Refunded')]
  //     } else {
  //       // not refunded yet -> provide link
  //       return [h(ButtonSecondary, {onClick: this.toggleWhy.bind(this), id: 'notRefundedYet'}, 'Why?'), h(LinkPrimary, {to: '/assessment/' + assessment.address}, 'Refund')]
  //     }
  //   } else {
  //     // NOTE this section could be refactored to be smaller, as the only thing that varies is the text of the button. But i am keeping this
  //     // longer structure becasue once we want to provide different links on the why-button, it will come in handy to have the cases be more explicit.
  //     // no violation!
  //     // is the user done (for the respective stage?)
  //     let buttonList = [
  //       h(ButtonSecondary, {
  //         onClick: () => setCardVisibility(assessment.address, !assessment.hidden)
  //       }, assessment.hidden ? 'Unhide' : 'Hide')
  //     ]
  //     if (assessment.stage < Stage.Done && assessment.userStage === assessment.stage) {
  //       buttonList.push(
  //         h(LinkPrimary,
  //           {to: '/assessment/' + assessment.address},
  //           assessment.userStage === Stage.None ? 'View' : StageDisplayNames[assessment.stage]))
  //     } else {
  //       buttonList.push(
  //         h(LinkPrimary,
  //           {to: '/assessment/' + assessment.address},
  //           assessment.userStage === Stage.None ? 'View' : CompletedStages[assessment.stage]))
  //     }
  //     return buttonList
  //   }
  // }

  // returns the two buttons at the bottom of the assessment Card
  linkButtons (assessment, isAssessee, setCardVisibility) {
    let buttonList = []
    let secondButtonText = ''

    // First button is always 'WHY', unless the assessment is in 'available' mode, in which case it's "Hide"
    if (assessment.stage === 1 && assessment.userStage === 1) {
      buttonList.push(h(
        ButtonSecondary, {
          onClick: () => setCardVisibility(assessment.address, !assessment.hidden)
        }, assessment.hidden ? 'Unhide' : 'Hide')
      )
    } else {
      // Why text is determined by the assessment data

      let whyText = 'available'
      let userFault = (assessment.violation && assessment.userStage === assessment.stage) || assessment.userStage === Stage.Burned

      if (assessment.violation) {
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
      }
      buttonList.push(
        h(ButtonSecondary, {onClick: this.toggleWhy.bind(this), id: whyText}, 'Why?')
      )
    }

    // The second button is determined by the assessment's state
    if (assessment.userStage === Stage.None) {
      // Waiting for other users
      secondButtonText = 'View'
    } else if (secondButtonText === '' && assessment.stage < Stage.Done && assessment.userStage === assessment.stage) {
      // 'Active' status
      secondButtonText = StageDisplayNames[assessment.stage]
    } else if (secondButtonText === '') {
      // 'Completed' assessments
      secondButtonText = CompletedStages[assessment.stage]
    }
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

    let explainerCard = h(cardContainer, [this.state.whyReason
    ])

    if (this.state.toggleWhy) {
      return explainerCard
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
