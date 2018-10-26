// this component loads the network and userAddress before anything else, in order to load/persist the right data
import {Component} from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'
import Web3 from 'web3'

type Props = {
  setNetworkAndUser: any 
}
export class InitialMetamaskLoader extends Component<Props> {

  constructor (props) {
    super(props)
    this.state = {
      status: 'initial',
    }
  }
  componentDidMount() {
    if (typeof (window as any)['web3'] === 'undefined') {
      this.setState({status:'NoMetaMask'})
    }

    let web3 = new Web3((window as any)['web3'].currentProvider)
    let accounts = await web3.eth.getAccounts()
    let networkID = await web3.eth.net.getId()

    if (accounts.length === 0) {
      this.setState({status:'UnlockMetaMask'})
    } else {
      this.props.setNetworkAndUser(networkID,userAddress)
    }
  }

  render () {
    switch(this.state.status) {
      case null:
      case "initial": {
        return h('div', 'Loadin metamask')
      }
      case "loaded":{
        return this.props.children
      }
      default:
        return h('div',this.state.status)
    }
  }
}

export default InitialMetamaskLoader
