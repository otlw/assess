import styled from 'styled-components'

// styles

const ButtonPrimary = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.secondary};
background-color: ${props => props.theme.primary};
`

export default ButtonPrimary
