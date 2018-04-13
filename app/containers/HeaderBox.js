import { connect } from 'react-redux'
import Header from '../components/Header'
import { web3Connect, receiveVariable } from '../actions/async.js'

const mapStateToProps = state => {
  return {
    web3_version: state.ethereum.web3_version,
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID,
    balance: state.ethereum.balance
  }
}

const mapDispatchToProps = {
  web3Connect,
  receiveVariable
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
