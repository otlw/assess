import styled from 'styled-components'

const TextHeadline = styled('h2').attrs({className: 'f2 fw4 mv0'})`
color: ${props => props.theme.primary};
`

export default TextHeadline
