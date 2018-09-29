// TxItem: renders individual tx view

// import dependencies
import * as React from 'react'
var h = require('react-hyperscript')
// import * as h from 'react-hyperscript'
import { Transaction } from '../../../store/transaction/reducer'
// import styled from 'styled-components'

// declare interfaces
interface ITxItemProps {
	transaction: Transaction
}

// export SFC
export const TxItem: React.SFC<ITxItemProps> = (props) => {
	return h('div', `transaction: ${props.transaction}`)
}

