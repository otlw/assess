import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

const ButtonHelpStyle = styled('button').attrs({className: 'flex items-center justify-center content-center f7 fw1 br-100 bn ttu uppercase pointer'})`
width: 16px;
height: 16px;
color: ${props => props.theme.tertiary};
background-color: ${props => props.theme.primary};
`
const TooltipStyle = styled('div').attrs({className: 'flex items-center justify-center content-center'})`
width: 30px;
height: 20px;
color: ${props => props.theme.tertiary};
background-color: ${props => props.theme.primary};
position:absolute;
bottom:30px;
`

const ButtonHelpFrame=styled('div')`
position:relative;
`

type HelpButtonState = {
  open: boolean,
}
export class ButtonHelp extends Component<any, HelpButtonState> {
	constructor (props:any) {
	    super(props)
	    this.state = {
	      open: false,
	    }
	}

	toggleTooltip(){
		this.setState({open:!this.state.open})
	}

	render () {
	    return (h(ButtonHelpFrame,[
	    	(this.state.open)? h(TooltipStyle,"very very very very looonnnnnnnnng tooltip"):null,
	    	h(ButtonHelpStyle,{onClick:this.toggleTooltip.bind(this)},"?")
	    ]))
	}
}

export const ButtonPrimary = styled('button').attrs<{active:boolean}>(
  {className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'} )`
color: ${props => !props.active ? props.theme.tertiary : props.theme.positiveGreenContrast};
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

const styleButtonClose = styled('button').attrs({className: 'flex h-100 items-center justify-center pa0 bg-transparent pointer br-100'})`
transition:0.2s ease-in-out;
border: 1px solid transparent;
width: 32px;
height: 32px;
:hover {border: 1px solid ${props => props.theme.primary};}`

const icoClose = require('../../assets/ico-close.svg');
const imgClose = styled('img').attrs({alt:'close', src: icoClose})`
width: 16px;
`
