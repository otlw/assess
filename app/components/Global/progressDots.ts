import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  length: number,
  step: number
  failed: boolean
}

// Display a progress bar made of dots, of 'length' specified in props.
// "step"-prop designates the step that is colored as active, unless it is the last
// step, in which case it is considered complete (as in our use case the last
// step is always passive)
// The starting index is 0.
const progressDots = (props:Props)=> {
	let Dots = []
	for (let i = 0; i < props.length; i++) {
		let newDot = h(Inactive)
		if (i < props.step || props.step === props.length - 1){
			newDot = h(Complete)
		} else if (i === props.step){
			newDot = props.failed ? h(Failed) : h(Active)
		}
	  Dots.push(newDot);
	}
  return h(styleProgressBar,Dots)
}

export default progressDots

// styles

const styleProgressBar = styled('div').attrs({className: 'flex flex-row w-auto items-center'})`
`


const Inactive = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.primary};
`

const Active = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.primary};
background: ${props => props.theme.primary};
`
const Complete = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.positiveGreen};
background: ${props => props.theme.positiveGreen};
`

const Failed = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.negativeRed};
background: ${props => props.theme.negativeRed};
`
