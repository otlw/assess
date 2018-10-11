import { Component } from 'react'
import styled from 'styled-components'
import { statusMessage } from '../../../utils.js'
import { ButtonPrimary } from '../../Global/Buttons.ts'
var h = require('react-hyperscript')

class FailedBar extends Component {
  refund () {
    this.props.refund(this.props.assessment.address, this.props.assessment.stage)
  }

  showWhy () {
    console.log('TODO: explain why????')
  }

  render () {
    let assessment = this.props.assessment
    let userFault = assessment.userStage === assessment.stage
    let StageDescriptor = statusMessage(this.props.userAddress === assessment.assessee, assessment)
    return (
      h(containerProgressBar, [
        h(rowObjectText, StageDescriptor),
        (h(WhyButton, {onClick: this.showWhy.bind(this)}, 'Why?'),
        // has the user been at fault?
          !userFault
          // if not, has he been refunded yet?
            ? !assessment.refunded
            // user has not been refunded yet -> show button
              ? h(ButtonPrimary, {onClick: this.refund.bind(this)}, 'Refund')
              : h(ButtonPrimary, 'Refunded')
            : undefined
        )
      ])
    )
  }
}

// TODO add txList

export default FailedBar

export const WhyButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const containerProgressBar = styled('div').attrs({className: 'flex flex-row w-100 pa3 items-center shadow-4'})`
margin-top: 1px;
min-height: 64px;
background-color: ${props => props.theme.bgSecondary};
`

// TODO need to rename to progressBarTextDescription
export const StageDescriptor = styled('div').attrs({className: 'flex w-auto items-center justify-center f5 gray debug'})`
color: ${props => props.theme.primary};
`

export const rowObjectText = styled('div').attrs({className: 'flex w-100 items-center justify-between br b--light-gray f5 gray'})`;
`
