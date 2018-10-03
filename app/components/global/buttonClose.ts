import styled from 'styled-components'
import h from 'react-hyperscript'

const icoClose = require('../../assets/ico-close.svg');

type Props = {
  onClick:any
}

const buttonClose = (props:Props) => {
    return h(styleButtonClose, {onClick: props.onClick}, [
        h(imgClose)
    ])
}

export default buttonClose

// styles

export const styleButtonClose = styled('button').attrs({className: 'flex h-100 items-center justify-center pa0 mr2 bg-transparent pointer br-100'})`
transition:0.2s ease-in-out;
border: 1px solid transparent;
width: 32px;
height: 32px;
:hover {border: 1px solid ${props => props.theme.primary};}`

export const imgClose = styled('img').attrs({alt:'close', src: icoClose})`
width: 16px;
`
