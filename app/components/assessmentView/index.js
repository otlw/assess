import { Component } from 'react'
import AssessmentData from './AssessmentData'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentViewApp extends Component {

  render () {
    console.log('render')
    if(this.props.selectedAssessment === '') {
      this.props.setAssessment(this.props.match.params.id)
    }
    if (!this.props.assessments.hasOwnProperty(this.props.selectedAssessment)) {
      console.log('assessment not in state, lets fetch it...')
      this.props.fetchAssessmentData(this.props.selectedAssessment, true, true)
      return h('div', 'fetching data from chain...')
    } else {
      let assessment = this.props.assessments[this.props.selectedAssessment]
      return (
        h('div',[
    	    h('div',"This will display two components for status and the assessors"),
          h(AssessmentData, {
            address: this.props.selectedAssessment,
            cost: assessment.cost,
            stage: assessment.stage,
            assessee: assessment.assessee
          }),
    	    h('div','placehodler for assessorList')
          // h(AssessorList, {address: this.assessmentAddress})
 	      ])
      )
    }
  }
}

export default AssessmentViewApp
