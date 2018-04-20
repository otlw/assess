import { Component } from 'react'
import AssessmentData from './AssessmentData'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentView extends Component {

  render () {
    // if rendered for the first time, put assessment address into state
    if (this.props.selectedAssessment === '') {
      this.props.setAssessment(this.props.match.params.id)
      return h('div', 'Loading...')
    }
    if (!this.props.assessment) {
      //assessment not there -> fetch basic info
      this.props.fetchAssessmentData(this.props.selectedAssessment)
      return h('div', '1/2: fetching data from chain...')
    }
    else if (!this.props.assessment.hasOwnProperty("assessors")) {
      // basic data is there, but no assessors
      this.props.fetchAssessors(
        this.props.selectedAssessment,
        this.props.assessment.stage
      )
      return h('div', '2/2: fetching assessors from event-logs...')
    }
    else {
      let assessment = this.props.assessment
      console.log(assessment)
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
          h(AssessorList, {
            userAddress: this.props.userAddress,
            assessmentAddress: this.props.selectedAssessment,
            assessors: assessment.assessors,
            stage: assessment.stage
          })
 	      ])
      )
    }
  }
}

export default AssessmentView
