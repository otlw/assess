import { connect } from 'react-redux'
import FilterView from './FilterView'
import { fetchLatestAssessments } from '../../../actions/assessmentActions.js'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.ethereum.userAddress,
    isConnected: state.ethereum.isConnected
  }
}

const mapDispatchToProps = {
  fetchLatestAssessments
}
export default connect(mapStateToProps, mapDispatchToProps)(FilterView)
