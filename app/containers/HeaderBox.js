import { connect } from 'react-redux'
import Header from '../components/Header'
import { web3Connect, receiveVariable } from '../actions/async.js'

const mapStateToProps = state => {
  return {
    web3_version: state.web3_version,
    userAddress: state.userAddress,
    networkID: state.networkID,
    balance: state.balance
  }
}

const mapDispatchToProps = {
  web3Connect,
  receiveVariable
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
