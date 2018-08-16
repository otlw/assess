import { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { removeTransaction } from '../actions/transActions.js'

import {networkName} from '../constants.js'

var h = require('react-hyperscript')

// TODO comment on what to expect as props
export class TxStatus extends Component {
  deleteTX () {
    this.props.removeTX(this.props.transaction.txHash)
  }

  render () {
    let tx = this.props.transaction
    let targetURL = 'https://' + (networkName(this.props.networkID) === 'Mainnet' ? '' : networkName(this.props.networkID) + '.') + 'etherscan.io/tx/' + tx.txHash
    return h(rowTransaction, [
      h(textTransaction, ': ' + tx.status + '  '),
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
