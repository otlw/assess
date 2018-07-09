import { Component } from 'react'
import MeetingPointForm from './MeetingPointForm.js'
import TxList from '../../TxList.js'
import { MeetingPointButton } from '../AssessmentData/style.js'
var h = require('react-hyperscript')

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
          onClick: this.toggleMPeditability.bind(this),
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
