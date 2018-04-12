import { Component } from 'react'
import AssessmentData from './AssessmentData'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentViewApp extends Component {

  render () {
    // console.log('viewappProps', this.props)
    if (this.props.selectedAssessment === '') {
      this.props.setAssessment(this.props.match.params.id)
      return h('div', 'Loading...')
    }
    if (!this.props.assessments.hasOwnProperty(this.props.selectedAssessment)) {
      //assessment not there -> fetch basic info
      this.props.fetchAssessmentData(this.props.selectedAssessment)
      return h('div', '1/2: fetching data from chain...')
    }
    else if (!this.props.assessments[this.props.selectedAssessment].hasOwnProperty("assessors")) {
      // basic data is there, but no assessors
      this.props.fetchAssessors(
        this.props.selectedAssessment,
        this.props.assessments[this.props.selectedAssessment].stage
      )
      return h('div', '2/2: fetching assessors from event-logs...')
    }
    else {
      // console.log('aseessors in state:', this.props.assessments[this.props.selectedAssessment]['assessors'])
      // console.log('facts in state:', this.props.assessments[this.props.selectedAssessment]['assessors'])
      let assessment = this.props.assessments[this.props.selectedAssessment]
      // console.log('assessment ',assessment )
      return (
        h('div',[
    	    h('div',"Imagine the following stylishly displayed:"),
          h(AssessmentData, {
            address: assessment.address,
            cost: assessment.cost,
            size: assessment.size,
            stage: assessment.stage,
            assessee: assessment.assessee
          }),
    	    h('div','placehodler for assessorList'),
          h(AssessorList, {
            userAddress: this.props.userAddress,
            address: this.props.selectedAssessment,
            assessors: assessment.assessors,
            stage: assessment.stage
          })
 	      ])
      )
    }
  }
}

export default AssessmentViewApp
