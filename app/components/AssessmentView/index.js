import { connect } from 'react-redux'
import { Component } from 'react'
import AssessmentView from './AssessmentView.js'
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
    return h(AssessmentView, {assessment: this.props.assessment, userAddress: this.props.userAddress})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewUnconnected)
