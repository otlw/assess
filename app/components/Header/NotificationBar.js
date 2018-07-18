import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

export class NotificationBar extends Component {
  closeBar () {
    this.props.setNotificationBar({display: false})
  }

  render () {
    return (
      h('div', {},
        this.props.data.type === 'success'
          ? h(NotificationBarFrame, {type: 'success'}, [
            h('span', 'Success! Your assessment has been created. Click '),
            h(Link, {to: '/assessment/' + this.props.data.assessmentId}, 'here'),
            h('span', ' to view the assessment details.'),
            h(closeButton, {onClick: this.closeBar.bind(this)}, 'X')
          ])
          : h(NotificationBarFrame, {type: 'error'}, [
            h('span','Oops! Your assessment wasn’t created due to a technical error. Click '),
            h(Link, {to: '/concepts'}, 'here'),
            h('span', ' to try again.'),
            h(closeButton, {onClick: this.closeBar.bind(this)}, 'X')
          ])
      )
    )
  }
}

export default NotificationBar

// styles
const NotificationBarFrame = styled('div')`
  text-align:center;
  padding: 0.8em 0;
  background-color: ${props => props.type === 'success' ? '#52CCAF' : '#FF8080'};
  vertical-align:top;
  position:relative;
`
const closeButton = styled('div')`
  font-size:1.5em;
  margin:0.3em;
  cursor:pointer;
  display:inline-block;
  top:0;
  right:0;
  position:absolute;
`
