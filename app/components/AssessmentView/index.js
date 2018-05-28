import { connect } from 'react-redux'
import AssessmentView from './ViewContainer.js'
import {setAssessment, resetLoadedDetails} from '../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    selectedAssessment: state.assessments.selectedAssessment
  }
}

const mapDispatchToProps = {
  setAssessment,
  resetLoadedDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentView)
