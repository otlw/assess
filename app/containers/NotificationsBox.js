import { connect } from 'react-redux'
import Notifications from '../components/Notifications'

const mapStateToProps = state => {
  return {
    notifications: state.notifications
  }
}

export default connect(mapStateToProps)(Notifications)
