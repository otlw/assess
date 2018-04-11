import { connect } from 'react-redux'
import Header from '../components/Header'
import { web3Connect, receiveVariable } from '../actions/async.js'

const mapStateToProps = state => {
  return {
    web3_version: state.connect.web3_version,
    userAddress: state.connect.userAddress,
    networkID: state.connect.networkID,
    balance: state.connect.balance
  }
}

const mapDispatchToProps = {
  web3Connect,
  receiveVariable
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
