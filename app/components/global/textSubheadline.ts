import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string
}
const textSubheadline = (props:Props) => {
    return h(styleSubheadline, props.text)
}

export default textSubheadline

// styles

const styleSubheadline = styled('h3').attrs({className: 'f3 fw4'})`
color: ${props => props.theme.secondary};
`
