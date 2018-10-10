import { connect as connectRedux } from 'react-redux'
import Header from './Header.js'
import { connect } from '../../store/web3/asyncActions'
import { LoadComponent } from '../hocs/loadComponent.js'
import { compose } from 'redux'

const mapStateToProps = state => {
  return {
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID,
    AhaBalance: state.ethereum.AhaBalance
  }
}

const mapDispatchToProps = {
  load: connect
}

export default compose(
  connectRedux(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(Header)
