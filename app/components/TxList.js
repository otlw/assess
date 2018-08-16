import { Component } from 'react'
import styled from 'styled-components'
import TxStatus from './TxStatus'
var h = require('react-hyperscript')

export class TxList extends Component {
  render () {
    return h(containerTransaction, this.props.transactions.map((tx) => {
      return h(TxStatus, {transaction: tx})
    }))
  }
}

const containerTransaction = styled('div').attrs({className: 'absolute dn w-100 h-100'})`
background-color: #8CDCC9;
`

export default TxList
