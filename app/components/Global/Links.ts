import styled from 'styled-components'
import { Link } from 'react-router-dom'

// These links are used in lieu of our ButtonPrimary and ButtonSecondary components in order to leverage Redux's Link feature. They are styled exactly like their corresponding primary/secondary button, and any updates to those buttons should be adopted by these components, too.

export const LinkPrimary = styled(Link).attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1 link'})`
color: ${props => props.theme.tertiary};
background-color: ${props => props.theme.primary};
`

export const LinkSecondary = styled(Link).attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn pointer shadow-1 link'})`
color: ${props => props.theme.primary};
background-color: ${props => props.theme.tertiary};
`
