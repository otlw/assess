import styled from 'styled-components'
import h from 'react-hyperscript'

export const ButtonHelp = styled('button').attrs({className: 'flex items-center justify-center content-center f6 fw1 br-100 bn ttu uppercase pointer'})`
width: 24px;
height: 24px;
color: ${props => props.theme.tertiary};
background-color: ${props => props.theme.primary};
`

export const ButtonPrimary = styled('button').attrs<{active:boolean}>(
  {className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1',
   style: null} )`
color: ${props => props.theme.tertiary};
background-color: ${props => !props.active ? props.theme.primary : props.theme.positiveGreen};
`

export const ButtonSecondary = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.primary};
background-color: ${props => props.theme.tertiary};
`

export const ButtonTertiary = styled('button').attrs({className: 'flex pv2 ph3 items-center justify-center br1 bg-transparent f6 ttu uppercase pointer'})`
color: ${props => props.theme.primary};
border: 1px solid ${props => props.theme.primary};
`

export const ButtonClose = (props:{onClick:any}) => {
  return h(styleButtonClose, props, [
    h(imgClose)
  ])
}

const styleButtonClose = styled('button').attrs({className: 'flex h-100 items-center justify-center pa0 mr2 bg-transparent pointer br-100'})`
transition:0.2s ease-in-out;
border: 1px solid transparent;
width: 32px;
height: 32px;
:hover {border: 1px solid ${props => props.theme.primary};}`

const icoClose = require('../../assets/ico-close.svg');
const imgClose = styled('img').attrs({alt:'close', src: icoClose})`
width: 16px;
`
