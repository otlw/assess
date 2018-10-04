import styled from 'styled-components'

const ButtonTertiary = styled('button').attrs({className: 'flex pv2 ph3 items-center justify-center br4 ttu uppercase pointer'})`
color: ${props => props.theme.primary};
border: 1px solid ${props => props.theme.primary};
`

export default ButtonTertiary
