import { compose } from 'redux'
import { connect } from 'react-redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import { fetchAssessors } from '../../../actions/assessmentActions.js'
import { loadingStage } from '../../../actions/utils.js'
import AssessorList from './AssessorList'

const mapStateToProps = (state) => {
  return {
    loadedAssessors: (state.loading.assessmentDetail.assessors === loadingStage.Done),
    assessors: state.assessments[state.assessments.selectedAssessment].assessors,
    loading: state.loading
  }
}

export default compose(
  connect(mapStateToProps, {load: fetchAssessors}),
  LoadComponent
)(AssessorList)
