import { compose } from 'redux'
import { connect } from 'react-redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import { loadingStage } from '../../../actions/utils.js'
import { fetchAssessmentData } from '../../../actions/assessmentActions.js'
import AssessmentData from './AssessmentData'

const mapStateToProps = (state) => {
  return {
    loadedInfo: (state.loading.assessmentDetail.info === loadingStage.Done),
    assessment: state.assessments[state.assessments.selectedAssessment],
    loading: state.loading
  }
}

export default compose(
  connect(mapStateToProps, {load: fetchAssessmentData}),
  LoadComponent
)(AssessmentData)
