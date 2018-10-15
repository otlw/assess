import styled from 'styled-components'
import { Link } from 'react-router-dom'
import h from 'react-hyperscript'

// These links are used in lieu of our ButtonPrimary and ButtonSecondary components in order to leverage Redux's Link feature. They are styled exactly like their corresponding primary/secondary button, and any updates to those buttons should be adopted by these components, too.

export const LinkPrimary = styled(Link).attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1 link'})`
color: ${props => props.theme.tertiary};
background-color: ${props => props.theme.primary};
`

export const LinkSecondary = styled(Link).attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn pointer shadow-1 link'})`
color: ${props => props.theme.primary};
background-color: ${props => props.theme.tertiary};
`

// This is the link-version of ButtonClose. It should reference that style.

export const LinkClose = (props:{to: string}) => {
  return h(styleLinkClose, {to: props.to},[
    h(imgClose)
  ])
}

export const LinkCloseRight = (props:{to: string}) => {
  return h(styleLinkCloseRight, {to: props.to},[
    h(imgClose)
  ])
}

const styleLinkClose = styled(Link).attrs({className: 'flex h-100 items-center justify-center pa0 mr2 bg-transparent pointer br-100'})`
transition:0.2s ease-in-out;
border: 1px solid transparent;
width: 32px;
height: 32px;
:hover {border: 1px solid ${props => props.theme.primary};}`

const styleLinkCloseRight = styleLinkClose.extend`
	position: absolute;
  top: 0;
  right: 0;
  margin: 40px;
`
const icoClose = require('../../assets/ico-close.svg');
const imgClose = styled('img').attrs({alt:'close', src: icoClose})`
width: 16px;
`
