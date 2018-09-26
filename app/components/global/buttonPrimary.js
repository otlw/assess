import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

export class compButtonPrimary extends Component {
  render () {
    return h(buttonPrimary, 'buttonText'
    )
  }
}

export default compButtonPrimary

// styles

const buttonPrimary = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.main};
background-color: ${props => props.theme.main};
`
