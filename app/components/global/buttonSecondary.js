import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

export class compButtonSecondary extends Component {
  render () {
    return h(buttonSecondary, 'buttonText'
    )
  }
}

export default compButtonSecondary

// styles

const buttonSecondary = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.primary};
background-color: ${props => props.theme.secondary};
`
