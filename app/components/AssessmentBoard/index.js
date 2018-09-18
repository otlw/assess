import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import AssessmentBoard from './AssessmentBoard.js'
import { setDashboardTab, dispatchToggleHidden } from '../../actions/navigationActions.js'
import { fetchLatestAssessments } from '../../actions/assessmentActions.js'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.ethereum.userAddress,
    networkID: state.ethereum.networkID,
    showHidden: state.navigation.showHiddenCards
  }
}

const mapDispatchToProps = {
  setDashboardTab,
  toggleHidden: dispatchToggleHidden,
  load: fetchLatestAssessments
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(AssessmentBoard)
