import { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { removeTransaction } from '../store/transaction/actions'
import { networkName } from '../constants.js'
var h = require('react-hyperscript')

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
    let textField = `Your transaction to ${phrasing[tx.purpose]} has been ${tx.status} -- see etherscan for details:  ` // Your transaction to <stake> has been <published>
    console.log('tx', tx)
    let targetURL = 'https://' + (networkName(this.props.networkID) === 'Mainnet' ? '' : networkName(this.props.networkID) + '.') + 'etherscan.io/tx/' + tx.txHash
    console.log('textField: ', textField)
    return h(rowTransaction, [
      // h(textTransaction, ': ' + tx.status + '  '),
      h(textTransaction, textField),
      h(linkTransaction, {href: targetURL, target: '_blank'},
        tx.txHash.substring(0, 5) + '...' + tx.txHash.substring(60)),
      h(buttonTransactionClose, {onClick: this.deleteTX.bind(this)}, 'X')
    ])
  }
}

const rowTransaction = styled('div').attrs({className: 'flex w-100 items-center justify-center'})`
`

const textTransaction = styled('h5').attrs({className: 'f5 fw4 dark-gray'})``

const linkTransaction = styled('a').attrs({className: 'link f5 fw4 blue'})``

const buttonTransactionClose = styled('button').attrs({className: 'bn pa3 bg-none'})``

const mapStateToProps = state => {
  return {
    networkID: state.ethereum.networkID
  }
}

const mapDispatchToProps = {
  removeTX: removeTransaction
}

export default connect(mapStateToProps, mapDispatchToProps)(TxStatus)
