import { Component } from 'react'
import MeetingPointForm from './MeetingPointForm.js'
import TxList from '../../TxList.js'
import styled from 'styled-components'
var h = require('react-hyperscript')

class MeetingPointEditButton extends Component {
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
        h(fathomButtonSecondary, {
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


const fathomButtonSecondary = styled('button').attrs({className: 'flex self-start ph4 pv2 fw4 f5 items-center align-center br-pill dark-blue'})`
box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
`
