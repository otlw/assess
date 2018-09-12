import { connect } from 'react-redux'
import {validateAndFetchAssessmentData} from '../../actions/assessmentActions'
import extend from 'xtend'
var h = require('react-hyperscript')

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.assessmentAddress]
  }
}

const mapDispatchToProps = {
  validateAndFetchAssessmentData
}

export const AssessmentLoader = (props) => {
  let assessmentAddress = props.assessmentAddress
  if (!props.assessment) props.validateAndFetchAssessmentData(assessmentAddress)
  return h(props.child, extend(props, {assessmentAddress}))
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentLoader)
