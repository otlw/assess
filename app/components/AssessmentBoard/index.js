import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import AssessmentBoard from './AssessmentBoard.js'
import { setDashboardTab, toggleHidden } from '../../store/navigation/actions'
import { fetchLatestAssessments } from '../../store/assessment/asyncActions'

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
  toggleHidden: toggleHidden,
  load: fetchLatestAssessments
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(AssessmentBoard)
