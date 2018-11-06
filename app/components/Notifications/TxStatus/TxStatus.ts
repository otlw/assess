import { Component } from 'react'
import styled from 'styled-components'
import { networkName } from '../../../constants.js'
import { removeTransaction } from '../../../store/transaction/actions'
import { Transaction } from '../../../store/transaction/reducer'
import { ButtonClose } from '../../Global/Buttons'
var h = require('react-hyperscript')

type Phrasing = {[key in Transaction['purpose']]: string}
const phrasing: Phrasing = Object.freeze({
  makeAssessment: 'create an assessment',
  setMeetingPoint: 'set a meeting point',
  meetingPointChange: 'make changes to the meeting point',
  stake: 'stake and become an assessor',
  commit: 'commit your assessment score',
  reveal: 'reveal your assessment score',
  refund: 'obtain a refund'
})

export interface ITxStatusProps {
  transaction: Transaction
  networkID: number
  removeTX: typeof removeTransaction
}

export class TxStatus extends Component<ITxStatusProps> {
  removeTX () {
    this.props.removeTX(this.props.transaction.txHash)
  }

  render () {
    let tx = this.props.transaction
    let textField = `Your transaction to ${phrasing[tx.purpose]} has been ${tx.status} -- see etherscan for details:  `
    let targetURL = 'https://' + (networkName(this.props.networkID) === 'Mainnet' ? '' : networkName(this.props.networkID) + '.') + 'etherscan.io/tx/' + tx.txHash

    return h(rowTxContainer, [
      h(textTransaction, textField),
      h(linkTransaction, { href: targetURL, target: '_blank' },
        tx.txHash.substring(0, 5) + '...' + tx.txHash.substring(60)),
      h(ButtonClose, { onClick: this.removeTX.bind(this) })
    ])
  }
}

export default TxStatus

// styled
const rowTxContainer = styled('div').attrs({ className: 'flex flex-row w-100 h3 items-center justify-center br2 pv1 shadow-4' })`
  border-color: ${props => props.theme.tertiary};
`

const textTransaction = styled('h5').attrs({ className: 'f5 fw4 pa2 dark-gray' })``

const linkTransaction = styled('a').attrs({ className: 'link f5 fw4 blue' })``
