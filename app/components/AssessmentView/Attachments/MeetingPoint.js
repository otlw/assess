import { Component } from 'react'
import MeetingPointForm from './MeetingPointForm.js'
var h = require('react-hyperscript')

export class MeetingPoint extends Component {

  storeData (values) {
    this.props.storeData(this.props.address, values.data)
    console.log('propsIn store', this.props.address)
  }

  render () {
    return (
      h('div', [
        h('span', 'Meeeeeting Point: '),
        h('span', this.props.meetingPoint),
        h(MeetingPointForm, {onSubmit: this.storeData.bind(this)})
      ])
    )
  }
}

export default MeetingPoint
