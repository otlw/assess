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

// TODO
// 1. Need a dynamic way to set the # of progress dots for different flows
// 2. What's the best implementation for setting active/inactive states? A single const for the 'dot' that has props passed to it to set it active/inactive? I'm not sure how to implement that.

const assessmentIndicatorInactive = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.primary};
`

// commented out due to conflict. this will get cleared up on merge and is subordinate. you can replace this.
// const assessmentIndicatorActive = styled('div').attrs({className: 'flex ba br-100 mh2'})`
//height: 10px;
//width: 10px;
//color: ${props => props.theme.primary};
//background: ${props => props.theme.primary};
//`
