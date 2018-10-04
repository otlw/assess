import styled from 'styled-components'

const TextLabel = styled('h5').attrs({className: 'f5 fw4 mv0 ttu uppercase'})`
color: ${props => props.theme.primary};
`

export default TextLabel
