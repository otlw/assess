import { connect } from 'react-redux'
import Status from '../components/Status'
import { web3Connect, receiveVariable } from '../actions/async.js'

const mapStateToProps = state => {
  return {
    block: state.block,
    web3_version: state.web3_version,
    mewAddress: state.mewAddress,
    ConceptRegistry: state.ConceptRegistry,
    userAddress: state.userAddress,
    networkID: state.networkID,
    balance: state.balance
  }
}

const mapDispatchToProps = {
  web3Connect,
  receiveVariable
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)
