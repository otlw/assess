import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string
}
const textBody = (props:Props) => {
    return h(styleTextBody, props.text)
}

export default textBody

// styles

const styleTextBody = styled('h5').attrs({className: 'f5 fw4 mv0'})`
color: ${props => props.theme.secondary};
`
