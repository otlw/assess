import styled from 'styled-components'

type Props = {
  width:number
}

const inputField = styled('input').attrs<Props>({className: (props:Props) => 'flex bn br2 pa2 mr2 w'+props.width})`
outline: none;
color: ${props => props.theme.primary};
background-color: ${props => props.theme.tertiary};
`

export default inputField
