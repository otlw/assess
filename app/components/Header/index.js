import { connect as connectRedux } from 'react-redux'
import Header from './Header.js'
import { connect } from '../../store/web3/asyncActions'
import { LoadComponent } from '../hocs/loadComponent.js'
import { compose } from 'redux'
import { setNotificationBar } from '../../store/navigation/actions'

const mapStateToProps = state => {
  return {
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID,
    AhaBalance: state.ethereum.AhaBalance,
    notificationBar: state.navigation.notificationBar
  }
}

const mapDispatchToProps = {
  setNotificationBar: setNotificationBar,
  load: connect
}

export default compose(
  connectRedux(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(Header)
