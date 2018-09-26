import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

export class compButtonTertiary extends Component {
  render () {
    return h(buttonTertiary, 'buttonText'
    )
  }
}

export default compButtonTertiary

// styles

const buttonTertiary = styled('button').attrs({className: 'flex pv2 ph3 items-center justify-center br4 ttu uppercase pointer'})`
color: ${props => props.theme.primary};
border: 1px solid ${props => props.theme.primary};
`
