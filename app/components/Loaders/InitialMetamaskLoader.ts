// this component loads the network and userAddress before anything else, in order to load/persist the right data
import { Component } from 'react'
import h from 'react-hyperscript'
import Web3 from 'web3'

type State = {
  status: string
  networkID: number
  userAddress: string
}

type Props = {
  child: any
}

export class InitialMetamaskLoader extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      status: 'initial',
      networkID: 0,
      userAddress: ''
    }
  }
  async componentDidMount () {
    // Modern dapp browsers...
    let web3: any
    if ((window as any)['ethereum']) {
      web3 = new Web3((window as any)['ethereum'])
      try {
        // Request account access if needed
        await (window as any)['ethereum'].enable()
      } catch (error) {
        // User denied account access...
        // TODO setup 'user rejection modal'
        console.log('user rejection')
        this.setState({ status: 'UserRejection' })
      }
    } else if ((window as any)['web3']) { // Legacy dapp browsers...
      web3 = new Web3((window as any)['web3'].currentProvider)
      // Acccounts always exposed
    } else { // Non-dapp browsers...
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      this.setState({ status: 'NoMetaMask' })// TODO this modal shouldnt be able to be closed
    }

    web3 = new Web3((window as any)['web3'].currentProvider)
    let accounts = await web3.eth.getAccounts()
    let networkID = await web3.eth.net.getId()

    if (accounts.length === 0) {
      this.setState({ status: 'UnlockMetaMask' })
    } else {
      this.setState({ status: 'loaded', networkID, userAddress: accounts[0] })
    }
  }

  render () {
    let child = this.props.child
    switch (this.state.status) {
    case null:
    case 'initial':
      return h('div', 'Loading metamask')

    case 'loaded':
      return child(this.state.networkID + this.state.userAddress)
    default:
      return h('div', this.state.status)
    }
  }
}

export default InitialMetamaskLoader
