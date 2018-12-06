import { connect } from 'react-redux'
import Header from './Header.js'

const mapStateToProps = state => {
  return {
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID,
    AhaBalance: state.ethereum.AhaBalance
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
