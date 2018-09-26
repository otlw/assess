import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'
import icoClose from '../../../assets/ico-close.svg'

export class compButtonClose extends Component {
  render () {
    return h(buttonClose, [
      h(imgClose, {alt: 'icoClose', src: icoClose, className: ''})
    ])
  }
}

export default compButtonClose

// styles

export const buttonClose = styled('button').attrs({className: 'flex h-100 items-center justify-center pa0 mr2 bg-transparent pointer br-100'})`
transition:0.2s ease-in-out;
border: 1px solid transparent;
width: 40px;
height: 32px;
:hover {border: 1px solid ${props => props.theme.primary};}`

export const imgClose = styled('img').attrs({className: ''})`
width: 16px;
`
