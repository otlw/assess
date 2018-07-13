import { connect } from 'react-redux'
import { Component } from 'react'
import AssessmentData from './AssessmentData.js'
import {validateAndFetchAssessmentData} from '../../actions/assessmentActions'
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
    let address = this.props.match.params.id
    if (!this.props.assessment) this.props.validateAndFetchAssessmentData(address)
    return h(AssessmentData, {assessment: this.props.assessment, userAddress: this.props.userAddress})
  }
}

export const AssessmentView = connect(mapStateToProps, mapDispatchToProps)(AssessmentViewUnconnected)
