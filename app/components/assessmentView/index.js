import { Component } from 'react'
import AssessmentData from './AssessmentData'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentViewApp extends Component {

  render () {
    if(this.props.selectedAssessment === '') {
      this.props.setAssessment(this.props.match.params.id)
      return h('div', 'Loading...')
    }
    if (!this.props.assessments.hasOwnProperty(this.props.selectedAssessment)) {
      this.props.fetchAssessmentData(this.props.selectedAssessment, true, true)
      return h('div', 'fetching data from chain...')
    } else {
      let assessment = this.props.assessments[this.props.selectedAssessment]
      return (
        h('div',[
    	    h('div',"Imagine the following stylishly displayed:"),
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
