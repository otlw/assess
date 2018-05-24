import { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { removeTransaction } from '../actions/transActions.js'

var h = require('react-hyperscript')

const txItem = styled.section`
color:${props => props.theme.primary};
border-color:palevioletred;
background-color: paleyellow;
cursor: pointer;
`

export class TxStatus extends Component {
  deleteTX () {
    this.props.removeTX(this.props.transaction.txHash)
  }

  render () {
    let tx = this.props.transaction
    console.log('transaction', this.props.transaction)
    return h(txItem, [
      h('span', {title: tx.txHash}, tx.txHash.substring(0, 5) + '...' + tx.txHash.substring(60)),
      h('span', ': ' + tx.status + '  '),
      h('button', {onClick: this.deleteTX.bind(this)}, 'X')
    ])
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {
  removeTX: removeTransaction
}

export default connect(mapStateToProps, mapDispatchToProps)(TxStatus)
