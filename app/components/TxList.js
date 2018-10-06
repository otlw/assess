import { Component } from 'react'
import styled from 'styled-components'
import TxStatus from './TxStatus'
var h = require('react-hyperscript')

export class TxList extends Component {
  render () {
    console.log('TxList -- props: ', this.props) // DEBUG
    // this should not be necessary but somehow if this next line is not here
    // a big green empty field will be displayed
    if (this.props.transactions.length === 0) { return null }
    return h(containerTransaction, this.props.transactions.map((tx) => {
      return h(TxStatus, {transaction: tx})
    }))
  }
}

const containerTransaction = styled('div').attrs({className: 'relative flex flex-row items-center justify-between w-100 pv3 bg-light-green br2 shadow-4'})``

export default TxList
