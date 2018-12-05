import { connect } from 'react-redux'
import AssessmentBoard from './AssessmentBoard.js'
import { setDashboardTab, toggleHidden } from '../../store/navigation/actions'

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
  toggleHidden: toggleHidden
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentBoard)
