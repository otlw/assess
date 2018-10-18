import styled from 'styled-components'
import { Component } from 'react'
import h from 'react-hyperscript'

export const cardContainer = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4'})`
height: 420px; width: 300px;
background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #CFF9EF 85.98%);
`

const titleStyle = styled('div').attrs({className: 'flex f3'})`
color: ${props => props.theme.tertiary};
`

const textStyle = styled('div').attrs({className: 'flex f6'})`
color: ${props => props.theme.tertiary};
`
const backButtonStyle = styled('div').attrs({className: 'flex f6'})`
color: ${props => props.theme.tertiary};
`


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
	    return (h(cardContainer,[
	    	h(titleStyle,this.props.title),
	    	h(textStyle,this.props.text),
	    	h(backButtonStyle,{onClick:this.goBack.bind(this)},"Back")
	    ]))
	}
}


export default cardContainer
