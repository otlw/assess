import styled from 'styled-components'

const ButtonHelp = styled('button').attrs({className: 'flex items-center justify-center content-center f6 fw1 br-100 bn ttu uppercase pointer'})`
width: 24px;
height: 24px;
color: ${props => props.theme.secondary};
background-color: ${props => props.theme.primary};
`

export default ButtonHelp
