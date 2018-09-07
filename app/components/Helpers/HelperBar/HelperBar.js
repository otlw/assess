import { Component } from 'react'
import styled from 'styled-components'
var h = require('react-hyperscript')

export class HelperBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showHelper: true
    }
  }

  gotIt () {
    this.setState({showHelper: false})
  }

  resetVisits () {
    this.props.resetVisits()
  }

  nextScreen () {
    this.props.setHelperBar(this.props.topic.followUp.target)
  }

  render () {
    let topic = this.props.topic
    if (topic) {
      if (this.state.showHelper) {
        return (
          h(barContainer, [
            h(barObject, [
              h(barTextTitle, topic.title)
            ]),
            h(barObject, [
              h(barTextDescription, topic.text)
            ]),
            (topic.followUp
              ? h(barObject, [
                h(barButtonPrimary, {onClick: this.nextScreen.bind(this)}, topic.followUp.linkText)
              ])
              : null),
            h(barObject, [
              h(barButtonClose, {onClick: this.gotIt.bind(this)}, 'Got it!') // TODO this could set a mark in state that the info has been seen already
            ]) //,
            // h('button', {onClick: this.resetVisits.bind(this)}, 'resetToNoob!') // this is for us, so we can pretend being a first timer
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

export const barContainer = styled('div').attrs({className: 'absolute flex flex-row items-center justify-around w-100 pv3 bg-light-green'})`
`

export const barObject = styled('div').attrs({className: 'flex items-center justify-center mh2'})`
`

export const barTextDescription = styled('h5').attrs({className: 'f5 dark-green'})`
`

export const barTextTitle = styled('h4').attrs({className: 'f5 dark-green'})`
`
export const barButtonClose = styled('button').attrs({className: 'flex items-center justify-center pa2 ba br-100 b--dark-green bg-none'})`
`

export const barButtonPrimary = styled('button').attrs({className: 'flex ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-green near-white ttu uppercase'})`
`
