import { Component } from 'react'
import styled from 'styled-components'
import icoClose from '../../../assets/ico-close.svg'

var h = require('react-hyperscript')

export class HelperBar extends Component {
  gotIt () {
    this.props.setHelperBar('')
  }

  resetVisits () {
    this.props.resetVisits()
  }

  nextScreen () {
    this.gotIt()
    this.props.setHelperBar(this.props.topic.followUp.target)
  }

  render () {
    let topic = this.props.topic
    if (topic) {
      if (this.props.showBar) {
        return (
          h(barContainer, [
            h(barContainerTitle, [
              h(icoQuestion, '?'),
              h(barTextTitle, topic.title)
            ]),
            h(barObject, [
              h(barTextDescription, topic.text),
              (topic.followUp
                ? h(barButtonPrimary, {onClick: this.nextScreen.bind(this)}, topic.followUp.linkText || 'Learn More')
                : null)
            ]),
            h(barButtonClose, {onClick: this.gotIt.bind(this)}, h('img', {alt: 'icoClose', src: icoClose, className: 'h1 ma1'})) // TODO this could set a mark in state that the info has been seen already
            //
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

export const barContainer = styled('div').attrs({className: 'absolute flex flex-row items-center justify-between w-100 pv3 bg-light-green shadow-3'})`
`

export const barObject = styled('div').attrs({className: 'flex items-center justify-center mh2'})`
`

export const barContainerTitle = styled('div').attrs({className: 'flex items-center justify-center mh2 ba br1 b--green'})`
flex-shrink: 0;
`

export const icoQuestion = styled('div').attrs({className: 'flex items-center justify-center w2 h2 mr2 bg-green light-green br'})`
`

export const barTextTitle = styled('h4').attrs({className: 'f5 fw4 dark-green mv0 ph2'})`
`

export const barTextDescription = styled('h5').attrs({className: 'f5 fw4 dark-green mv0'})`
flex-shrink: 2;
`

export const barButtonClose = styled('button').attrs({className: 'flex items-center justify-center w2 h2 mh2 ba br-100 b--near-black bg-transparent'})`
outline: 0px;
flex-shrink: 0;
transition: 0.2s ease-in-out;
:hover {background-color:hsla(158, 70%, 65%, 1); cursor:pointer;}
`

export const barButtonPrimary = styled('button').attrs({className: 'flex f5 bg-transparent ph1 pv1 ml1 bn dark-green ttu uppercase bw1 b--dark-green cursor'})`
outline: 0px;
transition: 0.2s ease-in-out;
:hover {cursor:pointer; background-color: hsla(158, 70%, 65%, 1);}

`
