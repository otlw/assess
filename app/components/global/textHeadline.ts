import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string
}
const textHeadline = (props:Props) => {
    return h(styleHeadline, props.text)
}

export default textHeadline

// styles

const styleHeadline = styled('h2').attrs({className: 'f2 fw4'})`
color: ${props => props.theme.primary};
`
