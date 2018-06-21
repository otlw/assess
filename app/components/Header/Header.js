import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import fathomLogo from '../../assets/fathom_monkey_beret_color_cropped.svg'

import {networkName} from '../../constants.js'

// styles
const HeaderBar = styled('div')`
  padding: 0.8em 0;
  background-color: ${props => props.theme.primary};
  border-bottom: 0.5px solid ${props => props.theme.light};
  position:relative;
  font-size:0.8em;
`

const Logo = styled('img')`
  margin: 0 1.25%;
  padding: 0 1.25%;
  text-align: center;
  display: inline-block
  width:5%;
  vertical-align:top;
`

const value = styled('span')`
  color:${props => props.theme.primary}
`

const key = styled('span')`
  color:${props => props.theme.dark}
  font-style:bold
  font-size:1.1em
`

const Box = styled('div')`
  padding: 0.5em 1em;
  margin-top:0.5em;
  background-color: ${props => props.theme.light};
  display: inline-block;
  width:85%;
  text-align:center;
  vertical-align:top;
`

export class Header extends Component {
  render () {
    return (
      h(HeaderBar, [
        h(Link, {to: '/'}, h(Logo, {alt: 'logo', src: fathomLogo})),
        h(Box, [
          h('div', {style: {display: 'inline-block', marginRight: '2em'}}, [
            h(key, 'Network: '),
            h(value, networkName(this.props.networkID))
          ]),
          h('div', {style: {display: 'inline-block', marginRight: '2em'}}, [
            h(key, 'Your Address: '),
            h(value, this.props.userAddress.substring(0, 8) + '...' + this.props.userAddress.substring(35, 42))
          ]),
          h(key, (this.props.AhaBalance / 1e9).toString().substring(0, 6) + ' AHA')
        ])
      ])
    )
  }
}

export default Header
