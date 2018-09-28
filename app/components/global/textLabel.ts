import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string
}
const textLabel = (props:Props) => {
    return h(styleLabel, props.text)
}

export default textLabel

// styles

const styleLabel = styled('h5').attrs({className: 'f5 fw4 mv0 ttu uppercase'})`
color: ${props => props.theme.primary};
`
