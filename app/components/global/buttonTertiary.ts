import styled from 'styled-components'

const ButtonTertiary = styled('button').attrs({className: 'flex pv2 ph3 items-center justify-center f6 br1 bg-transparent ttu uppercase pointer'})`
color: ${props => props.theme.primary};
border: 1px solid ${props => props.theme.primary};
transition: 0.2s ease-in-out;
:hover {
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.tertiary};
  }
`

export default ButtonTertiary
