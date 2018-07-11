import { connect } from 'react-redux'
import { LoadingStage } from '../../../constants.js'
import AssessorList from './AssessorList'

const mapStateToProps = (state) => {
  return {
    loadedAssessors: (state.loading.assessmentDetail.assessors === LoadingStage.Done),
    assessors: state.assessments[state.assessments.selectedAssessment].assessors
  }
}

export default connect(mapStateToProps)(AssessorList)
