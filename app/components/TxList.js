import { Component } from 'react'
import TxStatus from './TxStatus'
var h = require('react-hyperscript')

export class TxList extends Component {
  render () {
    return h('div', this.props.transactions.map((tx) => {
      return h(TxStatus, { transaction: tx })
    }))
  }
}

export default TxList
