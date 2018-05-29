import { connect } from 'react-redux'
import FilterView from './FilterView'
import {setDashboardTab} from '../../../actions/navigationActions.js'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.ethereum.userAddress,
    selectedTab: state.navigation.dashboardTab
  }
}

const mapDispatchToProps = {
  setDashboardTab
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterView)
