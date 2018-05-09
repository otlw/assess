import { Component } from 'react'
import AssessmentData from './AssessmentData'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentView extends Component {
  render () {
    // if rendered for the first time, put assessment address into state
    let selectedAssessment = this.props.match.params.id
    if (!this.props.assessment) {
      // assessment not there -> fetch basic info
      this.props.fetchAssessmentData(selectedAssessment)
      return h('div', '1/2: fetching data from chain...')
    } else if (!this.props.assessment.valid) {
      // if wrong assessment address, display relevant view
      return h('div', '*** Wrong Assessment Address or Wrong Concept Registry ***')
    } else if (!this.props.assessment.hasOwnProperty('assessors')) {
      // if no assessors and the address of the assessment is correct, fetch assessors
      this.props.fetchAssessors(
        selectedAssessment,
        this.props.assessment.stage
      )
      return h('div', '2/2: fetching assessors from event-logs...')
    } else {
      let assessment = this.props.assessment
      return (
        h('div', [
          h('div', '============AssessmentData================================='),
          h(AssessmentData, {
            address: assessment.address,
            cost: assessment.cost,
            size: assessment.size,
            stage: assessment.stage,
            assessee: assessment.assessee
          }),
          h('div', '============Assessors================================='),
          h(AssessorList, {
            userAddress: this.props.userAddress,
            assessmentAddress: selectedAssessment,
            assessors: assessment.assessors,
            stage: assessment.stage
          })
        ])
      )
    }
  }
}

export default AssessmentView
