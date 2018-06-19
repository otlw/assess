import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

// import fathomLogo from '../../assets/fathom_monkey_beret_color.svg'
import fathomLogo from '../../assets/test.svg'

const NetworkNames = {
  4: 'rinkeby',
  1: 'mainnet',
  3: 'ropsten',
  42: 'kovan'
}

// styles
const HeaderBar = styled('div')`
  padding: 0.8em 0;
  background-color: ${props => props.theme.primary};
  border-bottom: 0.5px solid ${props => props.theme.light};
  position:relative;
  font-size:0.8em;
`

// const HomeButton = styled(Link)`
//   margin: 0.3em 1.25%;
//   padding: 0.2em 1.25%;
//   text-align: center;
//   background-color:${props => props.theme.light};
//   border: 0.5px solid ${props => props.theme.dark};
//   border-radius: 1em;
//   text-decoration: none;
//   font-size:1.6em;
//   display: inline-block
//   position: relative;
//   width:5%;
// `

const Logo = styled('img')`
  margin: 0 1.25% 0 1.25%;
  padding: 0 1.25%;
  //height:6em;
  text-align: center;
  // background-color:${props => props.theme.light};
  // border: 0.5px solid ${props => props.theme.dark};
  // border-radius: 1em;
  // text-decoration: none;
  // font-size:1.6em;
  display: inline-block
  //position: relative;
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
    let network
    if (NetworkNames[this.props.networkID]) {
      network = NetworkNames[this.props.networkID]
    } else {
      network = 'Local or unknown'
    }
    return (
      h(HeaderBar, [
        // an icon instead of 'Home' would be nice
        // h(HomeButton, {to: '/'}, h('img',{alt:"logo",src:fathomLogo,style:{height:"1.5em",width:"1em"}})),
        h(Link, {to: '/'}, h(Logo, {alt: 'logo', src: fathomLogo})),
        h(Box, [
          h('div', {style: {display: 'inline-block', marginRight: '2em'}}, [
            h(key, 'Network: '),
            h(value, network)
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
