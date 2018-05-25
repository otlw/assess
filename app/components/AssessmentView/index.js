import { connect } from 'react-redux'
import AssessmentView from './AssessmentView'
import {setAssessment} from '../../actions/assessmentActions'

const mapStateToProps = (state, ownProps) => {
  return {
    selectedAssessment: state.assessments.selectedAssessment
  }
}

const mapDispatchToProps = {
  setAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentView)
