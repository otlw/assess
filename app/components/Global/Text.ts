import styled from 'styled-components'


export const Body = styled('h5').attrs<{feedBack?:string}>({className: 'f5 fw4 mv0'})`
color: ${props => props.feedBack ? (props.feedBack === 'success' ? props.theme.positiveGreenContrast : props.theme.negativeRedContrast) : props.theme.textBody};
`

export const Subheadline = styled('h3').attrs({className: 'f3 fw4 mt3 mb0'})`
color: ${props => props.theme.secondary};
`

export const Body = styled('h5').attrs({className: 'f5 fw4 mv2'})`
color: ${props => props.theme.textBody};
`


export const Label = styled('h5').attrs({className: 'f5 fw4 mv0 ttu uppercase'})`
color: ${props => props.theme.primary};
`
