import { Component } from 'react'
import styled from 'styled-components'
import { TimeOutReasons } from '../../../constants.js'
var h = require('react-hyperscript')

// component to display all assessors
class FailedBar extends Component {
  refund () {
    this.props.refund(this.props.address, this.props.stage)
  }

  showWhy () {
    console.log('TODO: explain why????')
  }

  render () {
    console.log('porps', this.props)
    let userFault = this.props.userStage === this.props.stage
    let statusText
    let violation = this.props.violation
    let failedAct
    if (violation) {
      if (violation === TimeOutReasons.NotEnoughAssessors) {
        failedAct = 'stake.'
      } else if (violation === TimeOutReasons.NotEnoughCommits) {
        failedAct = 'commit.'
      } else if (violation === TimeOutReasons.NotEnoughReveals) {
        failedAct = 'reveal.'
      }
    }
    if (userFault) {
      statusText = 'You forgot to ' + failedAct + ' Your stake and fee have been burned!'
    } else {
      statusText = 'Sorry, the assessment failed because ' + this.props.failedAssessors + ' assessor(s) failed to ' + failedAct
    }
    // add refund string
    if (this.props.refunded) {
      statusText += ' You have been refunded.'
    }
    return (
      h('div', [
        h(FailedStatusText, statusText),
        h(WhyButton, {onClick: this.showWhy.bind(this)}, 'Why?'),
        // has the user been at fault?
        !userFault
        // if not, has he been refunded yet?
          ? this.props.refunded
          // user has not been refunded yet -> show button
            ? h(RefundButton, {onClick: this.refund.bind(this)}, 'Refund')
            : h(RefundedButton, 'Refunded')
          : undefined
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
