import styled from 'styled-components'

const ButtonSecondary = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.primary};
background-color: ${props => props.theme.secondary};
`

export default ButtonSecondary
