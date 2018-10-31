// this component loads the network and userAddress before anything else, in order to load/persist the right data
import {Component} from 'react'
import h from 'react-hyperscript'
import Web3 from 'web3'

type State={
  status:string,
  networkID:number,
  userAddress:string
}

type Props={
  child:any
}

export class InitialMetamaskLoader extends Component<Props,State> {

  constructor (props:Props) {
    super(props)
    this.state = {
      status: 'initial',
      networkID:0,
      userAddress:''
    }
  }
  async componentDidMount() {
    if (typeof (window as any)['web3'] === 'undefined') {
      this.setState({status:'NoMetaMask'})
    }

    let web3 = new Web3((window as any)['web3'].currentProvider)
    let accounts = await web3.eth.getAccounts()
    let networkID = await web3.eth.net.getId()

    if (accounts.length === 0) {
      this.setState({status:'UnlockMetaMask'})
    } else {
      this.setState({status:'loaded',networkID,userAddress:accounts[0]})
    }
  }

  render () {
    let child=this.props.child
    switch(this.state.status) {
      case null:
      case "initial": 
        return h('div', 'Loading metamask')
      
      case "loaded":
        return child(this.state.networkID+this.state.userAddress)
      default:
        return h('div',this.state.status);
    }
  }
}

export default InitialMetamaskLoader
