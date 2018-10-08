import { Component } from 'react'
import styled from 'styled-components'
import { networkName } from '../../../constants.js'
var h = require('react-hyperscript')
let icoClose = require('../../../assets/ico-close.svg')

const phrasing = Object.freeze({
  makeAssessment: 'create an assessment',
  setMeetingPoint: 'set a meeting point',
  meetingPointChange: 'make changes to the meeting point',
  stake: 'stake and become an assessor',
  commit: 'commit your assessment score',
  reveal: 'reveal your assessment score',
  refund: 'obtain a refund'
})

// TODO comment on what to expect as props
export class TxStatus extends Component {
  deleteTX () {
    this.props.removeTX(this.props.transaction.txHash)
  }

  render () {
    let tx = this.props.transaction
    let textField = `Your transaction to ${phrasing[tx.purpose]} has been ${tx.status} -- see etherscan for details:  `
    let targetURL = 'https://' + (networkName(this.props.networkID) === 'Mainnet' ? '' : networkName(this.props.networkID) + '.') + 'etherscan.io/tx/' + tx.txHash
    console.log('tx', tx) // DEBUG
    console.log('textField: ', textField) // DEBUG

    return h(rowTxContainer, [
      h(textTransaction, textField),
      h(linkTransaction, {href: targetURL, target: '_blank'},
        tx.txHash.substring(0, 5) + '...' + tx.txHash.substring(60)),
      h(barButtonClose, {onClick: this.deleteTX.bind(this)}, h('img', {alt: 'icoClose', src: icoClose, className: 'h1 ma1'}))
    ])
  }
}

export default TxStatus

// styled components ------------------------ //
const rowTxContainer = styled('div').attrs({className: 'flex flex-row w-100 h3 items-center justify-center br2 pv1 shadow-4'})`
  border-color: ${props => props.theme.tertiary};
`

const textTransaction = styled('h5').attrs({className: 'f5 fw4 pa2 dark-gray'})``

// TODO: highlight keywords...
// const boldText = textTransaction.extend`
//   font-weight: bold;
// `

const linkTransaction = styled('a').attrs({className: 'link f5 fw4 blue'})``

const barButtonClose = styled('button').attrs({className: 'flex items-center justify-center w2 h2 mh4 br-100 b--near-black bg-transparent'})`
transition: 0.2s ease-in-out;
:hover {background-color:hsla(158, 70%, 65%, 1); cursor:pointer;}
`
