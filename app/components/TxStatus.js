import { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { removeTransaction } from '../actions/transActions.js'

import {networkName} from '../constants.js'

var h = require('react-hyperscript')

const txItem = styled.section`
background: papayawhip;
`

export class TxStatus extends Component {
  deleteTX () {
    this.props.removeTX(this.props.transaction.txHash)
  }

  render () {
    let tx = this.props.transaction
    let targetURL = 'https://' + (networkName(this.props.networkID) === 'Mainnet' ? '' : networkName(this.props.networkID) + '.') + 'etherscan.io/tx/' + tx.txHash
    return h(txItem, [
      h('span', 'Transaction sent: '),
      h('a', {href: targetURL, target: '_blank'},
        tx.txHash.substring(0, 5) + '...' + tx.txHash.substring(60)),
      h('span', ': ' + tx.status + '  '),
      h('button', {onClick: this.deleteTX.bind(this)}, 'X')
    ])
  }
}

const mapStateToProps = state => {
  return {
    networkID: state.ethereum.networkID
  }
}

const mapDispatchToProps = {
  removeTX: removeTransaction
}

export default connect(mapStateToProps, mapDispatchToProps)(TxStatus)
