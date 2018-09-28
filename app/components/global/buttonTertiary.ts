import styled from 'styled-components'
import h from 'react-hyperscript'

type Props = {
  text: string
}
const buttonTertiary = (props:Props) => {
    return h(styleButtonTertiary, props.text)
}

export default buttonTertiary

// styles

const styleButtonTertiary = styled('button').attrs({className: 'flex pv2 ph3 items-center justify-center br4 ttu uppercase pointer'})`
color: ${props => props.theme.primary};
border: 1px solid ${props => props.theme.primary};
`
