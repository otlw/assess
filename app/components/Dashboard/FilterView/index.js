import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import FilterView from './FilterView'
import { fetchLatestAssessments } from '../../../actions/assessmentActions.js'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.ethereum.userAddress
  }
}

export default compose(
  connect(mapStateToProps, {load: fetchLatestAssessments}),
  LoadComponent
)(FilterView)
