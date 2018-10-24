import styled from 'styled-components'
import { Component } from 'react'
import h from 'react-hyperscript'
import {ButtonPrimary} from './Buttons'

export const cardContainer = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4'})`
height: 420px; width: 300px;
background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #CFF9EF 85.98%);
`


// The Explanation Card is used in the back of assessment cards and concept cards

const titleStyle = styled('div').attrs({className: 'flex f3'})`
color: ${props => props.theme.primary};
`

const textStyle = styled('div').attrs({className: 'flex f6'})`
color: ${props => props.theme.secondary};
`
const backButtonContainer = styled('div').attrs({className: 'flex flex-row justify-end w-100'})`
`
const explanationFrame = styled('div').attrs({
  className: 'flex justify-between flex-column w-100 h-100 pa3'
})``

type ExplanationCardProps = {
  title: string,
  text: string,
  goBack: any,
}
export class ExplanationCard extends Component<ExplanationCardProps, any> {
	constructor (props:any) {
	    super(props)
	}

	goBack(){
		this.props.goBack()
	}

	render () {
		console.log(ButtonPrimary)
	    return (h(cardContainer,[
	    	h(explanationFrame,[
		    	h(titleStyle,this.props.title),
		    	h(textStyle,this.props.text),
		    	h(backButtonContainer,[
		    		h(ButtonPrimary,{onClick:this.goBack.bind(this),active:false},"Back")
		    	])
		    ])
	    ]))
	}
}


export default cardContainer
