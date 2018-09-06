import { Component } from 'react'
import styled from 'styled-components'
import TxList from '../../TxList.js'
import { statusMessage } from '../../../utils.js'
var h = require('react-hyperscript')

class FailedBar extends Component {
  refund () {
    this.props.refund(this.props.assessment.address, this.props.assessment.stage)
  }

  showWhy () {
    console.log('TODO: explain why????')
  }

  render () {
    console.log('props', this.props)
    let assessment = this.props.assessment
    let userFault = assessment.userStage === assessment.stage
    let statusText = statusMessage(this.props.userAddress === assessment.assessee, assessment)
    return (
      h('div', [
        h(FailedStatusText, statusText),
        (h(WhyButton, {onClick: this.showWhy.bind(this)}, 'Why?'),
        // has the user been at fault?
          !userFault
          // if not, has he been refunded yet?
            ? !assessment.refunded
            // user has not been refunded yet -> show button
              ? h(RefundButton, {onClick: this.refund.bind(this)}, 'Get refund')
              : h(RefundedButton, 'Refunded')
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
