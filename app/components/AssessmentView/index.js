import { connect } from 'react-redux'
import { Component } from 'react'
import AssessmentView from './AssessmentView.js'
import {validateAndFetchAssessmentData} from '../../store/assessment/asyncActions'
var h = require('react-hyperscript')

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id],
    userAddress: state.ethereum.userAddress
  }
}

const mapDispatchToProps = {
  validateAndFetchAssessmentData
}

class AssessmentViewUnconnected extends Component {
  render () {
    let assessmentAddress = this.props.match.params.id
    if (!this.props.assessment) this.props.validateAndFetchAssessmentData(assessmentAddress)
    return h(AssessmentView, {assessment: this.props.assessment, userAddress: this.props.userAddress})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewUnconnected)
