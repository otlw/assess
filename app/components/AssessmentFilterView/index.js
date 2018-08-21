import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import AssessmentFilterView from './AssessmentFilterView.js'

import {setDashboardTab} from '../../actions/navigationActions.js'
import { fetchLatestAssessments } from '../../actions/assessmentActions.js'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID
    // showHidden: state.navigation.showHidden // TODO write a button component that changes this
  }
}

const mapDispatchToProps = {
  setDashboardTab,
  load: fetchLatestAssessments
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(AssessmentFilterView)
