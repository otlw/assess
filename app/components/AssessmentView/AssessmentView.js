import { Component } from 'react'
import AssessmentData from './AssessmentData.js'
import MeetingPoint from './Attachments/'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentView extends Component {
  componentWillMount () {
    this.props.setAssessment(this.props.match.params.id)
  }

  render () {
    // if rendered for the first time, put assessment address into state
    // let selectedAssessment = this.props.match.params.id
    // if (!this.props.assessment) {
      // assessment not there -> fetch basic info
      // this.props.fetchAssessmentData(selectedAssessment)
      // return h('div', '1/2: fetching data from chain...')
    // } else if (!this.props.assessment.valid) {
      // if wrong assessment address, display relevant view
      // return h('div', '*** Wrong Assessment Address or Wrong Concept Registry ***')
    // } else if (!this.props.assessment.hasOwnProperty('assessors')) {
      // basic data is there, but no assessors
      // this.props.fetchAssessmentViewData(
        // selectedAssessment,
        // this.props.assessment.stage
      // )
      // return h('div', '2/2: fetching assessors from event-logs...')
    // } else {
    // let assessment = this.props.assessment
    if (this.props.selectedAssessment) {
      console.log('trigger render of assessmnetdata with', this.props.selectedAssessment)
      return (
        h('div', [
          h('div', '============AssessmentData================================='),
          h(AssessmentData),
          h('div', '============Assessors================================='),
          // h(AssessorList, {
          //   userAddress: this.props.userAddress,
          //   assessmentAddress: selectedAssessment,
          //   assessors: assessment.assessors,
          //   stage: assessment.stage
          // })
        ])
      )
    } else {
      return h('div', 'Fetching address from url')
    }
  }
}

export default AssessmentView
