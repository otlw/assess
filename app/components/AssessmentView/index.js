import { Component } from 'react'
import { connect } from 'react-redux'
import AssessmentData from './AssessmentData'
import {validateAndFetchAssessmentData} from '../../actions/assessmentActions'
var h = require('react-hyperscript')

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id]
  }
}

const mapDispatchToProps = {
  validateAndFetchAssessmentData
}

export const AssessmentView = (props) => {
  let address = props.match.params.id
  if (props.assessment) {
    if (props.assessment.invalid) {
      return h('div', 'invalid assessment!')
    }
    return h(AssessmentData, {assessment: props.assessment, address})
  }
  props.validateAndFetchAssessmentData(address)
  return h('div', 'loading')
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentView)
