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

const styleInputField = styled('input').attrs({className: 'flex w4 bn br2 pa2 mr2'})`
outline: none;
color: ${props => props.theme.primary};
background-color: ${props => props.theme.tertiary};
`
