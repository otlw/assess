import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import FilterView from './FilterView'

import {setDashboardTab} from '../../../actions/navigationActions.js'
import { fetchLatestAssessments } from '../../../actions/assessmentActions.js'

const mapStateToProps = state => {
  return {
    assessments: state.ethereum.userAssessments,
    userAddress: state.ethereum.userAddress,
    selectedTab: state.navigation.dashboardTab,
    networkID: state.ethereum.networkID
  }
}

const mapDispatchToProps = {
  setDashboardTab,
  load: fetchLatestAssessments
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(FilterView)
