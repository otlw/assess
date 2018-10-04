import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string,
  onClick:any
}
const buttonSecondary = (props:Props) => {
    return h(styleButtonSecondary, {onClick: props.onClick}, props.text)
}

export default buttonSecondary

// styles

const styleButtonSecondary = styled('button').attrs({className: 'flex pv2 ph4 items-center justify-center br-pill bn ttu uppercase pointer shadow-1'})`
color: ${props => props.theme.primary};
background-color: ${props => props.theme.secondary};
`
