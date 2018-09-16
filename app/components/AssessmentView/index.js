import { connect } from 'react-redux'
import { Component } from 'react'
import {AssessmentView} from './AssessmentView.js'
import {validateAndFetchAssessmentData} from '../../actions/assessmentActions'
import { updateHelperScreen, setHelperBar } from '../../actions/navigationActions.js'
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
  updateHelperScreen,
  setHelperBar
}

class AssessmentViewContainer extends Component {
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
    return h(AssessmentView, {
      assessment: this.props.assessment,
      userAddress: this.props.userAddress,
      visits: this.props.visits,
      setHelperBar: this.props.setHelperBar
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewContainer)
