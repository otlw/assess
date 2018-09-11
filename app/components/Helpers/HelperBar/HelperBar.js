import { Component } from 'react'
import styled from 'styled-components'
var h = require('react-hyperscript')

export class HelperBar extends Component {
  gotIt () {
    this.props.updateHelperScreen('closeBar')
  }

  resetVisits () {
    this.props.resetVisits()
  }

  nextScreen () {
    this.gotIt()
    this.props.updateHelperScreen(this.props.topic.followUp.target)
  }

  render () {
    let topic = this.props.topic
    if (topic) {
      if (this.props.showBar) {
        return (
          h('div', [
            h(HelperTitle, topic.title),
            h(HelperText, topic.text),
            (topic.followUp
              ? h(HelperFollowUpButton, {onClick: this.nextScreen.bind(this)}, topic.followUp.linkText || 'Learn More')
              : null),
            h('button', {onClick: this.gotIt.bind(this)}, 'got it!'), // TODO this could set a mark in state that the info has been seen already
            h('button', {onClick: this.resetVisits.bind(this)}, 'resetToNoob!') // this is for us, so we can pretend being a first timer
          ])
        )
      } else {
        return null
      }
    } else {
      // no helper screen active
      return h('div', '')
    }
  }
}

export default HelperBar

// style

export const HelperTitle = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const HelperText = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const HelperFollowUpButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
