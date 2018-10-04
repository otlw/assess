import styled from 'styled-components'

export const Body = styled('h5').attrs({className: 'f5 fw4 mv0'})`
color: ${props => props.theme.secondary};
`

export const Headline = styled('h2').attrs({className: 'f2 fw4 mv3'})`
color: ${props => props.theme.primary};
`

export const Label = styled('h5').attrs({className: 'f5 fw4 mv0 ttu uppercase'})`
color: ${props => props.theme.primary};
`

export const Subheadline = styled('h3').attrs({className: 'f3 fw4 mv3'})`
color: ${props => props.theme.secondary};
`
