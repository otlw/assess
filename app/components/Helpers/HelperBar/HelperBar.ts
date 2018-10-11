import { Component } from 'react'
import styled from 'styled-components'
import {Label, Body} from '../../Global/Text'
import {Props} from './index'
import { ButtonClose, ButtonTertiary } from '../../Global/Buttons'
var h = require('react-hyperscript')

export class HelperBar extends Component<Props> {
  closeBar () {
    this.props.setHelperBar(null)
  }

  // resetVisits () {
  //   this.props.resetVisits()
  // }

  learnMore () {
    this.closeBar()
    if (this.props.topic.learnMore) this.props.setModal(this.props.topic.learnMore.target)
  }

  render () {
    if (this.props.showBar) {
      let topic = this.props.topic
      return (
        h(helperBarContainer, [
          h(barContainer, [
            h(barContainerTitle, [
              h(icoQuestion, '?'),
              h(Label, topic.title)
            ]),
            h(barObject, [
              h(Body, topic.text),
              (topic.learnMore
               ? h(ButtonTertiary, {onClick: this.learnMore.bind(this)}, 'Learn More')
               : null)
            ]),
            h(ButtonClose, {onClick: this.closeBar.bind(this)})
            //
            // h('button', {onClick: this.resetVisits.bind(this)}, 'resetToNoob!') // this is for us, so we can pretend being a first timer
          ])
        ])
      )
    } else {
      return h('div', '')
    }
  }
}

export default HelperBar

// style
const helperBarContainer = styled('div').attrs({className: 'flex flex-row w-100 items-center justify-center'})``

export const barContainer = styled('div').attrs({className: 'relative flex flex-row items-center justify-between w-100 h3 pv3 mt3 br2 shadow-4'})`
max-width: 800px;
background-color: ${props => props.theme.tertiary};
`

export const barObject = styled('div').attrs({className: 'flex items-center justify-center mh2'})`
`

export const barContainerTitle = styled('div').attrs({className: 'flex items-center justify-center mh2 ba br1 b--green'})`
flex-shrink: 0;
color: ${props => props.theme.primary};
border-color: ${props => props.theme.primary};
`

export const icoQuestion = styled('div').attrs({className: 'flex items-center justify-center w2 h2 mr2 bg-green light-green br'})`
color: ${props => props.theme.tertiary};
background-color: ${props => props.theme.primary};
`
