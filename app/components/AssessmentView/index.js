import { connect } from 'react-redux'
import { Component } from 'react'
import AssessmentView from './AssessmentView.js'
import {validateAndFetchAssessmentData} from '../../actions/assessmentActions'
import { updateHelperScreen } from '../../actions/navigationActions.js'
var h = require('react-hyperscript')

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id],
    userAddress: state.ethereum.userAddress,
    visits: state.navigation.visits
  }
}

const mapDispatchToProps = {
  validateAndFetchAssessmentData,
  updateHelperScreen
}

class AssessmentViewUnconnected extends Component {
  componentWillMount () {
    let address = this.props.match.params.id
    if (!this.props.assessment) {
      this.props.validateAndFetchAssessmentData(address)
    } else {
      this.props.updateHelperScreen('assessmentView', {
        assessment: this.props.assessment,
        userAddress: this.props.userAddress
      })
    }
  }

  render () {
    if (!this.props.assessment) return h('div', 'Loading Data...')
    return h(AssessmentView, {assessment: this.props.assessment, userAddress: this.props.userAddress})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewUnconnected)
