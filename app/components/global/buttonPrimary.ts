import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string
}
const buttonPrimary = (props:Props) => {
    return h(styleButtonPrimary, props.text)
}

export default buttonPrimary

// styles

const styleButtonPrimary = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.secondary};
background-color: ${props => props.theme.primary};
`
