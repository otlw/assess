import styled from 'styled-components'
import h from 'react-hyperscript'


const progressBar = () => {
    return h(styleProgressBar, [
        h(assessmentIndicatorInactive)
    ])
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
