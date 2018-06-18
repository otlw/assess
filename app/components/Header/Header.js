import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import {networkName} from '../../constants.js'

// styles
const HeaderBar = styled('div')`
  padding: 0.5em 0;
  background-color: ${props => props.theme.primary};
  border-bottom: 0.5px solid ${props => props.theme.light};
  position:relative;
  font-size:0.8em;
`

const HomeButton = styled(Link)`
  margin: 0.3em 1.25%;
  padding: 0.2em 1.25%;
  text-align: center;
  background-color:${props => props.theme.light};
  border: 0.5px solid ${props => props.theme.dark};
  border-radius: 1em;
  text-decoration: none;
  font-size:1.6em;
  display: inline-block
  position: relative;
  width:5%;
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
  background-color: ${props => props.theme.light};
  display: inline-block;
  width:85%;
  text-align:center;
`

export class Header extends Component {
  render () {
    return (
      h(HeaderBar, [
        // an icon instead of 'Home' would be nice
        h(HomeButton, {to: '/'}, 'F'),
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
