import { Component } from 'react'
import AssessmentData from './AssessmentData'
var h = require('react-hyperscript')

export class AssessmentView extends Component {
  componentWillMount () {
    this.props.setAssessment(this.props.match.params.id)
  }

  componentWillUnmount () {
    console.log('componentWillUnMount ')
    this.props.resetLoadedDetails()
  }

  render () {
    if (this.props.selectedAssessment) {
      console.log('trigger render of assessmnetdata with', this.props.selectedAssessment)
      return (
        h('div', [
          h('div', '============AssessmentData================================='),
          h(AssessmentData)
        ])
      )
    } else {
      return h('div', 'Fetching address from url')
    }
  }
}

export default AssessmentView
