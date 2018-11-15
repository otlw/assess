import { connect as connectRedux } from 'react-redux'
import Header from './Header.js'

const mapStateToProps = state => {
  return {
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID,
    AhaBalance: state.ethereum.AhaBalance
  }
}

export default connectRedux(mapStateToProps, null)(Header)
