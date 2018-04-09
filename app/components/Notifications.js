import { Component } from 'react'
var h = require('react-hyperscript')

export class Notifications extends Component {
  componentWillMount () {
    // this.props.web3Connect()
  }

  render () {
    if (this.props.notifications.length === 0) {
      return null
    } else {
      return h('div', this.props.notifications.map((notif, k) => {
        if (notif.returnValues.sender) {
          return h('div', [
            h('br'),
            h('div', {style: {'fontSize': '1.8em', 'fontStyle': 'bold'}}, 'Notification'),
            h('br'),
            h('div', 'sender (concept) : '),
            h('div', notif.returnValues.sender),
            h('br'),
            h('div', 'user : '),
            h('div', notif.returnValues.user),
            h('br'),
            h('div', 'topic : '),
            h('div', notif.returnValues.topic)
          ])
        } else {
          return h('div', [
            h('br'),
            h('div', {style: {'fontSize': '1.8em', 'fontStyle': 'bold'}}, 'Notification'),
            h('div', '"no sender field')
          ])
        }
      }))
    }
  }
}

export default Notifications
