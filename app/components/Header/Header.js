import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import fathomLogo from '../../assets/fathom_monkey_beret_color_cropped.svg'

import {networkName} from '../../constants.js'

const Logo = styled('img')`
  margin: 0 1.25%;
  padding: 0 1.25%;
  text-align: center;
  display: inline-block
  width:5%;
  vertical-align:top;
`

export const Header = (props) => {
  let address = props.userAddress.substring(0, 8) + '...' + props.userAddress.substring(35, 42)
  let balance = (props.AhaBalance / 1e9).toString().substring(0, 6) + ' AHA'
  let network = networkName(props.networkID)

  return (
    h('div',
      {className: 'flex w-100 bg-dark-blue'},
      [
        h('ul',
          {className: 'list flex content-around flex-row w-100 pa2 ma0 items-end'},
          [
            h(Link, {to: '/'}, h(Logo, {alt: 'logo', src: fathomLogo})),
            h(HeaderItem, {name: 'Address', value: address}),
            h(HeaderItem, {name: 'Balance', value: balance}),
            h(HeaderItem, {name: 'Network', value: network})
          ]
        )
      ]
    )
  )
}

const HeaderItem = (props) => {
  return (
    h('li',
      {className: 'flex self-end content-end pr3'},
      [
        h('div',
          {className: 'flex ba br1 b--dark-purple lightest-blue'},
          [
            h('div', {className: 'ph3 pv2'}, props.name),
            h('div', {className: 'bg-lightest-blue dark-blue ph3 pv2'}, props.value)
          ])
      ]
    )
  )
}

export default Header
