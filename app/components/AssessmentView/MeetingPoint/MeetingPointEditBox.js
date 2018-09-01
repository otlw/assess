import { Component } from 'react'
import TxList from '../../TxList.js'
import styled from 'styled-components'
var h = require('react-hyperscript')

class MeetingPointEditBox extends Component {
  setMPEditiability () {
    this.props.dispatchSetInputBar('editMeetingPoint')
  }

  render () {
    return (
      h('div', [
        h(fathomButtonSecondary, {
          onClick: this.setMPEditiability.bind(this)
        }, 'edit'),
        this.props.transactions
          ? h(TxList, { transactions: this.props.transactions })
          : null
      ])
    )
  }
}

const fathomButtonSecondary = styled('button').attrs({ className: 'flex self-start ph4 pv2 fw4 f5 items-center align-center br-pill dark-blue' })`
box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
cursor:pointer;
`

export const ViewMeetingPoint = styled('button')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const EditMeetingPoint = styled('button')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export default MeetingPointEditBox
