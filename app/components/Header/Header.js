import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'

const NetworkNames = {
  4: 'rinkeby',
  1: 'mainnet',
  3: 'ropsten',
  42: 'kovan'
}

const buttonStyle={border:"1px solid grey",borderRadius:"1em",padding:"0.2em 1em",margin:"0.2em"}

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
      h('div', [
        h(Link,{style:buttonStyle, to: '/'}, "Home"),
        h('div', [
          h('span', 'Web3-version: '),
          h('span', this.props.web3_version)
        ]),
        h('div', [
          h('span', 'Network: '),
          h('span', network)
        ]),
        h('div', [
          h('span', 'user-address: '),
          h('span', this.props.userAddress)
        ]),
        h('div', [
          h('span', 'AHA balance: '),
          h('span', this.props.balance)
        ])
      ])
    )
  }
}

export default Header
