import { Component } from 'react'
import MeetingPointForm from './MeetingPointForm.js'
import TxList from '../../TxList.js'
import styled from 'styled-components'
var h = require('react-hyperscript')

const MeetingPointButton = styled('button')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export class MeetingPointEditButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayMPEdit: false
    }
  }

  storeData (values) {
    this.props.storeData(this.props.address, values.data)
    this.setState({displayMPEdit: false})
  }

  toggleMPeditability () {
    this.setState({displayMPEdit: !this.state.displayMPEdit})
  }

  render () {
    return (
      h('div', [
        h(MeetingPointButton, {
          onClick: this.toggleMPeditability.bind(this)
        }, 'edit'),
        this.state.displayMPEdit ? h(MeetingPointForm, {onSubmit: this.storeData.bind(this)}) : null,
        this.props.transactions
          ? h(TxList, {transactions: this.props.transactions})
          : null
      ])
    )
  }
}

export default MeetingPointEditButton
