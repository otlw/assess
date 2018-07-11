import { compose } from 'redux'
import { connect } from 'react-redux'
import { LoadComponent } from '../../hocs/loadComponent.js'
import { LoadingStage } from '../../../constants.js'
import { validateAndFetchAssessmentData } from '../../../actions/assessmentActions.js'
import AssessmentData from './AssessmentData'

const mapStateToProps = (state) => {
  return {
    loadedInfo: (state.loading.assessmentDetail.info === LoadingStage.Done),
    assessment: state.assessments[state.assessments.selectedAssessment],
    userAddress: state.ethereum.userAddress,
    invalidAssessment: state.assessments.selectedAssessment === 'invalid'
  }
}

export default compose(
  connect(mapStateToProps, {load: validateAndFetchAssessmentData}),
  LoadComponent
)(AssessmentData)
