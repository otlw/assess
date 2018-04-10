import { Component } from 'react'
var h = require('react-hyperscript')

export class Status extends Component {
  componentWillMount () {
    this.props.web3Connect()
  }

  togglePublicView () {
    if (this.props.userAddress === 'publicView') {
      this.props.web3Connect()
    } else {
      this.props.receiveVariable('userAddress', 'publicView')
    }
  }

  render () {
    // styles
    const buttonStyle = {textAlign: 'center', borderRadius: '0.8em', border: '1px solid black', margin: '1em 40%', padding: '0.2em 1em'}

    let buttonMsg = 'Public View'
    if (this.props.userAddress === 'publicView') {
      buttonMsg = 'Back to User View'
    }

    const NetworkNames = {
      4: 'rinkeby',
      1: 'mainnet',
      3: 'ropsten',
      42: 'kovan'
    }
    let network
    if (NetworkNames[this.props.networkID]) {
      network = NetworkNames[this.props.networkID]
    } else {
      network = 'Local or unknown'
    }
    return (
      h('div', [
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
        ]),
        h('div', {style: buttonStyle, onClick: this.togglePublicView.bind(this)}, buttonMsg)
      ])
    )
  }
}

export default Status
