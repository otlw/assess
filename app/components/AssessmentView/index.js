import { connect } from 'react-redux'
import { Component } from 'react'
import AssessmentView from './AssessmentView.js'
import {validateAndFetchAssessmentData} from '../../actions/assessmentActions'
import { setHelperScreen } from '../../actions/navigationActions.js'
import { showScreen } from '../../utils.js'
var h = require('react-hyperscript')

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.match.params.id],
    userAddress: state.ethereum.userAddress,
    visits: state.navigation.visits,
    helperScreen: state.navigation.helperScreen
  }
}

const mapDispatchToProps = {
  validateAndFetchAssessmentData,
  setHelperScreen
}

class AssessmentViewUnconnected extends Component {
  componentWillMount () {
    let address = this.props.match.params.id
    if (!this.props.assessment) {
      this.props.validateAndFetchAssessmentData(address)
    } else {
      let helperScreen = showScreen(this.props.visits, this.props.assessment, this.props.userAddress)
      if (helperScreen && helperScreen !== this.props.helperScreen) {
        console.log('displauing helper: ', helperScreen)
        this.props.setHelperScreen(helperScreen)
      }
    }
  }

  render () {
    return h(AssessmentView, {assessment: this.props.assessment, userAddress: this.props.userAddress})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewUnconnected)
