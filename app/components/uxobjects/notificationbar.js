import { Component } from 'react'
import styled from 'styled-components'
var h = require('react-hyperscript')

export class notificationBarUX extends Component {
  render () {
    return (
      h(barContainer, [
        h(barObject, [
          h(barButtonClose)
        ]),
        h(barObject, [
          h(barTextDescription, 'Description')
        ]),
        h(barObject, [
          h(barButtonPrimary, 'Next')
        ])
      ])
    )
  }
}

export const barContainer = styled('div').attrs({className: 'absolute flex flex-row items-center justify-around w-100 pv3 bg-light-green'})`
`

export const barObject = styled('div').attrs({className: 'flex items-center justify-center mh2'})`
`

export const barTextDescription = styled('h5').attrs({className: 'f5 dark-green'})`
`

export const barButtonClose = styled('button').attrs({className: 'flex items-center justify-center pa2 ba br-100 b--dark-green bg-none'})`
`

export const barButtonPrimary = styled('button').attrs({className: 'flex ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-green near-white ttu uppercase'})`
`

export default notificationBarUX
