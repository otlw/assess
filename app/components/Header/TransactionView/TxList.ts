// TxList: manages list of transactions; renders TxItem

// import dependencies
// import { Component } from 'react'
import * as React from 'react'
import * as h from 'react-hyperscript'
import styled from 'styled-components'
import TxItem from './TxItem'
// import Transaction type
import { Transaction } from '../../../store/transaction/reducer'

// declare interfaces
interface ITxListProps {
	// propNames: propTypes
	transactions: {[prop: string]: Transaction}
}

// export SFC
const TxList: React.SFC<ITxListProps> = (props) => {

	// make array; iterate over transactions obj, 
	// make TxItem component for each txObj and push into transactions array
	// 
	let transactions = []
	for (let tx in props.transactions) {
		let txObj = props.transactions[txHash]
		// ... //
	}

	return h('div', [])
}
export default TxList


// ******* From OLD TX-LIST *******

// import { Component } from 'react'
// import styled from 'styled-components'
// import TxStatus from './TxStatus'
// var h = require('react-hyperscript')

// export class TxList extends Component {
//   render () {
//     // this should not be necessary but somehow if this next line is not here
//     // a big green empty field will be displayed
//     if (this.props.transactions.length === 0) { return null }
//     return h(containerTransaction, this.props.transactions.map((tx) => {
//       return h(TxStatus, {transaction: tx})
//     }))
//   }
// }

// const containerTransaction = styled('div').attrs({className: 'absolute flex w-100 h-100'})`
// background-color: #8CDCC9;
// `

// export default TxList
