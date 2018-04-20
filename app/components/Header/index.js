import { connect as connectRedux } from 'react-redux'
import Header from './Header.js'
import { connect, receiveVariable } from '../../actions/async.js'

const mapStateToProps = state => {
  return {
    web3_version: state.ethereum.web3_version,
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID,
    balance: state.ethereum.balance
  }
}

const mapDispatchToProps = {
  connect,
  receiveVariable
}

export default connectRedux(mapStateToProps, mapDispatchToProps)(Header)
