import { connect } from 'react-redux'
import { Component } from 'react'
import AssessmentView from './AssessmentView.js'
import {validateAndFetchAssessmentData} from '../../store/assessment/asyncActions'
import { setHelperBar } from '../../store/navigation/actions'
var h = require('react-hyperscript')

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id],
    userAddress: state.ethereum.userAddress,
    transactions: Object.values(state.transactions).filter(x => x.address === ownProps.match.params.id)
  }
}

const mapDispatchToProps = {
  validateAndFetchAssessmentData,
  setHelperBar
}

class AssessmentViewUnconnected extends Component {
  render () {
    let assessmentAddress = this.props.match.params.id
    if (!this.props.assessment) this.props.validateAndFetchAssessmentData(assessmentAddress)
    return h(AssessmentView, {
      assessment: this.props.assessment,
      userAddress: this.props.userAddress,
      setHelperBar: this.props.setHelperBar,
      transactions: this.props.transactions,
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewUnconnected)
