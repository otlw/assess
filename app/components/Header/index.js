import { connect as connectRedux } from 'react-redux'
import Header from './Header.js'
import { connect } from '../../actions/web3Actions.js'
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

let check = compose(
  connectRedux(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(Header)

export default check
