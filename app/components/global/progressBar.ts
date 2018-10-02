import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  length: number,
  step:number
}

const progressBar = (props:Props) => {
	let Dots=[]
	let i=0
	for (i = 0; i < props.length; i++) { 
		let newDot=h(assessmentIndicatorInactive)
		if (i<props.step){
			newDot=h(assessmentIndicatorComplete)
		} else if (i==props.step){
			newDot=h(assessmentIndicatorActive)
		}
	    Dots.push(newDot);
	}
	console.log("DOts",Dots)
    return h(styleProgressBar, 
        Dots
    )
}

export default progressBar

// styles

const styleProgressBar = styled('div').attrs({className: 'flex flex-row w-auto items-center'})`
`


const assessmentIndicatorInactive = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.primary};
`

const assessmentIndicatorActive = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.primary};
background: ${props => props.theme.primary};
`
const assessmentIndicatorComplete = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: green;
background: green;
`
