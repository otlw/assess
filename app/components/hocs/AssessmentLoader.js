import { connect } from 'react-redux'
import {validateAndFetchAssessmentData} from '../../actions/assessmentActions'
var h = require('react-hyperscript')

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.address]
  }
}

const mapDispatchToProps = {
  validateAndFetchAssessmentData
}

export const AssessmentLoader = (props) => {
  let address = props.address

  if (!props.assessment) props.validateAndFetchAssessmentData(address)
  return h(props.child, {assessment: props.assessment, address})
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentLoader)
