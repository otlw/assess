import { connect } from 'react-redux'
import AssessmentData from './AssessmentData.js'
// import { storeDataOnAssessment } from '../../../actions/assessmentActions'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  // storeDataOnAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentData)
