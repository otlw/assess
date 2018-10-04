import { Component } from 'react'
import styled from 'styled-components'
import TxList from '../../TxList.js'
import { statusMessage } from '../../../utils.js'
import ButtonPrimary from '../../Global/Buttons.ts'
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
              ? h(buttonProgressActive, {onClick: this.refund.bind(this)}, 'Refund')
              : h(buttonProgressActive, 'Refunded')
            : undefined),
        this.props.transactions
          ? h(TxList, {transactions: this.props.transactions})
          : null
      ])
    )
  }
}

// TODO add txList

export default FailedBar

export const FailedStatusText = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const WhyButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const RefundButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const RefundedButton = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

//

export const containerProgressBar = styled('div').attrs({className: 'flex flex-row w-100 pa3 items-center shadow-3'})`
margin-top: 1px;
min-height: 64px;
`

export const ProgressButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const containerProgressButton = styled('div').attrs({className: 'flex w-auto items-center justify-center'})`
`

export const buttonProgressActive = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.tertiary};
background-color: ${props => props.theme.primary};
`

export const stageTexts = styled('h5').attrs({className: 'f5 fw4 mv0'})`
color: ${props => props.theme.primary};
`

// TODO need to rename to progressBarTextDescription
export const StageDescriptor = styled('div').attrs({className: 'flex w-auto items-center justify-center f5 gray debug'})`
color: ${props => props.theme.primary};
`

export const rowObjectButton = styled('div').attrs({className: 'flex w-auto items-center justify-center'})`
`

export const rowObjectText = styled('div').attrs({className: 'flex w-100 items-center justify-between br b--light-gray f5 gray'})`;
`
