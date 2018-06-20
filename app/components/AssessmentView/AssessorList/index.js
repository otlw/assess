import { compose } from 'redux'
import { connect } from 'react-redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import { fetchAssessors } from '../../../actions/assessmentActions.js'
import { LoadingStage } from '../../../constants.js'
import AssessorList from './AssessorList'

const mapStateToProps = (state) => {
  return {
    loadedAssessors: (state.loading.assessmentDetail.assessors === LoadingStage.Done),
    assessorStages: state.assessments[state.assessments.selectedAssessment].assessorStages,
    loading: state.loading,
    payouts: state.assessments[state.assessments.selectedAssessment].payouts
  }
}

export default compose(
  connect(mapStateToProps, {load: fetchAssessors}),
  LoadComponent
)(AssessorList)
