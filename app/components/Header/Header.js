import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import fathomLogo from '../../assets/fathom_monkey_beret_color_cropped.svg'

import {networkName} from '../../constants.js'

const Logo = styled('img').attrs({className: 'flex w2 mh2 self-center'})``

export const Header = (props) => {
  let userAddress = props.userAddress.substring(0, 8) + '...' + props.userAddress.substring(35, 42)
  let balance = (props.AhaBalance).toString() + ' AHA'
  let network = networkName(props.networkID)

  return (
    h(headerContainer,
      [
        h(headerRowLeft, [
          h(Link, {to: '/'}, h(Logo, {alt: 'logo', src: fathomLogo})),
          h(headerItem, {name: 'Address', value: userAddress}),
          h(headerItem, {name: 'Network', value: network > 10000000 ? 'Local' : network})
        ]),
        h(headerRowRight, [
          h(headerItemBalance, balance)
        ])
      ])
  )
}

const headerContainer = styled('ul').attrs({
  className: 'list flex w-100 flex-row flex-wrap pl0 pv2 ma0 items-start justify-between'})`
  background-color: ${props => props.theme.primary};
  `

const headerRowLeft = styled('ul').attrs({
  className: 'list pl0 flex w-auto flex-row ma0 items-center justify-start'})`
    `

const headerRowRight = styled('ul').attrs({
  className: 'list pl0 flex w-auto flex-row ma0 items-center justify-end'})`
      `

const headerItemBalance = styled('div').attrs({className: 'flex ba br1 ph3 pv2 mh4'})`
color: ${props => props.theme.primary};
background: ${props => props.theme.tertiary};
border-color: ${props => props.theme.primary};
`

const headerItemContainer = styled('li').attrs({className: 'flex ba br1 mh2'})`
color: ${props => props.theme.primary};
border-color: ${props => props.theme.tertiary};
`
const headerItemLabel = styled('div').attrs({className: 'ph3 pv2 br--right br1'})`
background: ${props => props.theme.tertiary};
`
const headerItemValue = styled('div').attrs({className: 'ph3 pv2 bl br--right br1 bg-transparent'})`
color: ${props => props.theme.tertiary};
`

const headerItem = (props) => {
  return (
    h(headerItemContainer,
      [
        h(headerItemLabel, props.name),
        h(headerItemValue, props.value)
      ])
  )
}

export default Header
