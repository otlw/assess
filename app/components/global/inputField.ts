import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string
}
const inputField = (props:Props) => {
    return h(styleInputField, props.text)
}

export default inputField

// styles

// TODO: Low priority: being able to set custom widths as different input fields need to handle different length inputs // (this is a UX fundamental. Refer to 'Proper Field Size' here: 
// https://uxplanet.org/designing-perfect-text-field-clarity-accessibility-and-user-effort-d03c1e26004b

const styleInputField = styled('input').attrs({className: 'flex w4 bn br2 pa2 mr2'})`
outline: none;
color: ${props => props.theme.primary};
background-color: ${props => props.theme.tertiary};
`
