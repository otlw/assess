import { Component } from 'react'
import MeetingPointForm from './MeetingPointForm.js'
import TxList from '../../TxList'
var h = require('react-hyperscript')

export class MeetingPoint extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayMPEdit: false
    }
  }

  storeData (values) {
    this.props.storeDataOnAssessment(this.props.address, values.data)
    this.setState({displayMPEdit: false})
  }

  toggleMPeditability () {
    this.setState({displayMPEdit: !this.state.displayMPEdit})
  }

  render () {
    console.log('thisprops;', this.props.transactions)
    let meetingPoint = this.props.meetingPoint || '<noMeetingPointSet>  '
    return (
      h('div', [
        h('span', 'Meeting Point: '),
        h('span', meetingPoint + '   '),
        h('button', {
          onClick: this.toggleMPeditability.bind(this),
          title: 'this only works if you\'re the assessee',
          disabled: !this.props.editable
        }, 'edit'),
        this.state.displayMPEdit ? h(MeetingPointForm, {onSubmit: this.storeData.bind(this)}) : null,
        this.props.transactions
          ? h(TxList, {transactions: this.props.transactions})
        : null
      ])
    )
  }
}

export default MeetingPoint
