// TxList: manages list of transactions; renders TxItem
// import * as React from 'react'
import { Component } from 'react'
// import * as h from 'react-hyperscript'
var h = require('react-hyperscript')
// import styled from 'styled-components'
import { TxItem } from './TxItem'
import { Transaction } from '../../../store/transaction/reducer'

// declare interfaces
interface ITxListProps {
	transactions: Transaction[]
	userAddress: string
  confirmAssessor: any,
  commit: any,
  reveal: any,
  storeDataOnAssessment: any,
  refund: any
}

// export const TxList: React.SFC<ITxListProps> = (props) => {
// 	// iterate over transactions
//   return h('div', props.transactions.map(tx => h(TxItem, {transaction: tx})))
// }

export class TxList extends Component<ITxListProps> {
	constructor (props: ITxListProps) {
		super(props)
	}
	render() {
		return h('div', this.props.transactions.map(tx => h(TxItem, {transaction: tx})))
	}
}
export default TxList