import { Component } from 'react'
import h from 'react-hyperscript'
// can we remove this? import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { Headline, Label, Body } from '../../Global/Text.ts'
import {LinkPrimary} from '../../Global/Links.ts'
import { ButtonSecondary } from '../../Global/Buttons.ts'
import progressDots from '../../Global/progressDots.ts'
import { ExplanationCard } from '../../Global/cardContainers.ts'
import { statusMessage, userStatus, mapAssessmentStageToStep } from '../../../utils.js'

export class AssessmentCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showBackSide: false,
      explanation: ''
    }
    this.isAssessee = props.userAddress === props.assessment.assessee
  }

  showBackSide (e) {
    if (e) {
      this.setState({showBackSide: !this.state.showBackSide, explanation: e.target.id || ''})
    } else {
      this.setState({showBackSide: !this.state.showBackSide})
    }
  }

  // returns the two buttons at the bottom of the assessment Card
  linkButtons () {
    let buttonList = []
    let assessment = this.props.assessment

    // This is the status from the user's pov and will determine what the right hand side button will display (the action button)
    let status = userStatus(assessment)

    // First button is always 'WHY', unless the assessment is in 'available' mode, in which case it's "Hide"
    if (status === 'Stake') {
      buttonList.push(h(
        ButtonSecondary, {
          onClick: () => this.props.setCardVisibility(assessment.address, !assessment.hidden)
        }, assessment.hidden ? 'Unhide' : 'Hide')
      )
    } else {
      buttonList.push(
        h(ButtonSecondary, {onClick: this.showBackSide.bind(this), id: status}, 'Why?')
      )
    }

    // Second Button
    buttonList.push(
      h(LinkPrimary,
        {to: (status === 'Closed' || status === 'Refunded') ? '/' : '/assessment/' + assessment.address},
        status
      )
    )

    return buttonList
  }

  render () {
    if (this.state.showBackSide) {
      // explanation card
      return h(ExplanationCard, {goBack: this.showBackSide.bind(this), title: this.state.explanation, text: this.state.explanation})
    } else {
      // regular content
      const assessment = this.props.assessment
      let stage = assessment.stage

      // set assessee/assessor view
      let status = statusMessage(this.isAssessee, assessment, this.props.transactions)
      console.log(assessment)
      return h(cardContainer, [
        h(cardContainerInfo, [
          h(cardTextObject, [
            h(Label, 'Assessment'),
            h(Headline, assessment.conceptData.name)
          ]),
          h(cardTextObject, [
            h(Label, 'Assessee'),
            h(Body, this.isAssessee ? 'You' : assessment.assessee.substring(0, 8) + '...')
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
          h('div', {className: 'flex flex-row justify-between w-100'}, this.linkButtons())
        ])
      ])
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
