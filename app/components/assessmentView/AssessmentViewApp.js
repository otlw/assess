import { Component } from 'react'
import AssessmentData from './AssessmentData'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentViewApp extends Component {
  constructor(props) {
    super(props);
    this.dataFetched = {assessors: false, info: false};
    this.assessmentAddress = this.props.match.params.id
    this.assessment
  }

  componentWillMount () {
    // console.log('props', this.props)
    if (this.props.assessments.hasOwnProperty(this.assessmentAddress) &&
        this.props.assessments[this.assessmentAddress].hasOwnProperty('cost')) {
      this.dataFetched.info = true
      console.log("assessment is in state")
    } else {
      console.log("assessment is NOT in state")
    }
    // check if general assessment data is already in state:
    // if (!this.assessment.cost) {
      // dispatch(fetchAssessmentData(this.AssessmentAddress, true, true))
    // } else {
      // this.dataFetched.info = true
    // }
    // if (this.props.assessment.assessors) {
      // this.dataFetched.assessors = true
    // } else {
      // fetch assessors
      // dispatch(fetchAssessmentData(this.AssessmentAddress, false, true))
    // }
  }


  render () {
    if (this.dataFetched.info) {
      let assessmentAddress = this.props.match.params.id
      return (
        h('div',[
    	    h('div',"AssessmentViewApp"),
          h(AssessmentData, {address: assessmentAddress}),
          h(AssessorList, {address: assessmentAddress})
 	      ])
      )
    } else {
      return h('div', 'fetching data from chain...')
    }

  }
}

export default AssessmentViewApp
