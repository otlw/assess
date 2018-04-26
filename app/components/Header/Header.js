import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const NetworkNames = {
  4: 'rinkeby',
  1: 'mainnet',
  3: 'ropsten',
  42: 'kovan'
}

// styles
const HeaderBar = styled('div')`
  padding: 0.5em 1em;
  background-color: #FBFBFB;
  border: 0.5px solid lightgrey;
  position:relative;
  font-size:0.8em;
`

const HomeButton = styled(Link)`
  margin: 0.2em;
  padding: 0.2em 1em;
  text-align: center;
  border: 0.5px solid lightgrey;
  border-radius: 1em;
  text-decoration: none;
  font-size:1.6em;
  display: inline-block
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`

const lightTitle = styled('div')`
  color:lightgrey
  font-style:italic
  font-size:0.8em
`

const value = styled('span')`
  color:#546e7a
`

const key = styled('span')`
  color:#29434e
  font-style:bold
  font-size:1.1em
`

const Box = styled('div')`
  padding: 0.5em 1em;
  background-color: #819ca9;
  border: 0.5px solid lightgrey;
  display: inline-block;
  margin-left:3em;
`

// const buttonStyle = {border: '1px solid grey', borderRadius: '1em', padding: '0.2em 1em', margin: '0.2em'}

export class Header extends Component {
  componentWillMount () {
    this.props.connect()
  }

  render () {
    let network
    if (NetworkNames[this.props.networkID]) {
      network = NetworkNames[this.props.networkID]
    } else {
      network = 'Local or unknown'
    }
    return (
      h(HeaderBar, [
        // an icon instead of 'Home' would be nice
        h(HomeButton, {to: '/'}, 'Fathom'),
        h(Box, [
          h(lightTitle, 'connection'),
          h(key, 'Network: '),
          h(value, network)
        ]),
        h(Box, [
          h(lightTitle, 'user'),
          h(key, 'Your Address: '),
          h(value, this.props.userAddress.substring(0, 12) + '...'),
          h(value, (this.props.AhaBalance / 1e9).toString().substring(0, 6) + ' AHA')
        ])
      ])
    )
  }
}

export default Header
