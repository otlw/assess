import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  length: number,
  step:number
  status: string
}

const progressDots = (props:Props) => {
	let Dots=[]
	let i=1
	for (i = 1; i < props.length+1; i++) {
		let newDot=h(Inactive)
		if ((i<props.step)||(props.status=="inactive"&&props.step==i)){
			newDot=h(Complete);
		} else if ((props.status=="active")&&(i==props.step)) {
			newDot=h(Active);
		} else if ((props.status=="failed")&&(i>=props.step)) {
			newDot=h(Failed);	

		}
	    Dots.push(newDot);
	}
    return h(styleProgressBar,
        Dots
    )
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
