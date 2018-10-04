import styled from 'styled-components'

const TextBody = styled('h5').attrs({className: 'f5 fw4 mv0'})`
color: ${props => props.theme.secondary};
`

export default TextBody
