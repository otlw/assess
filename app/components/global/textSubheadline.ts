import styled from 'styled-components'

const TextSubheadline = styled('h3').attrs({className: 'f3 fw4 mv0'})`
color: ${props => props.theme.secondary};
`
export default TextSubheadline
