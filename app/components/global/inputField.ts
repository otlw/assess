import styled from 'styled-components'
import h from 'react-hyperscript'


const inputField = (props:any) => {
    return h(styleInputField, props)
}

export default inputField

// styles

const styleInputField = styled('input').attrs({className: (props:any) => 'flex bn br2 pa2 mr2 w'+props.width})`
outline: none;
color: ${props => props.theme.primary};
background-color: ${props => props.theme.tertiary};
`
