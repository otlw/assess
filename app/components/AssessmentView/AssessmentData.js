import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import { loadingStage } from '../../actions/utils.js'
import { fetchAssessmentData } from '../../actions/assessmentActions.js'
import MeetingPoint from './Attachments/'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export const stages = Object.freeze({
  1: 'Open',
  2: 'Commit',
  3: 'Reveal',
  4: 'Finished'
})

export class AssessmentData extends Component {
  render () {
    if (this.props.loadedInfo) {
      let assessment = this.props.assessment
      return (
        h('div', [
          h('div', [
            h('span', 'Assessment address:  '),
            h('span', assessment.address)
          ]),
          h('div', [
            h('span', 'Assesseee: '),
            h('span', assessment.assessee)
          ]),
          h('div', [
            h('span', 'Cost: '),
            h('span', assessment.cost)
          ]),
          h('div', [
            h('span', 'Size: '),
            h('span', assessment.size)
          ]),
          h('div', [
            h('span', 'Stage: '),
            h('span', stages[assessment.stage]),
            h('span', ' (' + assessment.stage + '/4)')
          ]),
          h(MeetingPoint, {assessee: assessment.assessee}),
          h('div', '============Assessors================================='),
          h(AssessorList)//, {
        ])
      )
    } else {
      return h('div', 'Loading Data')
    }
  }
}

const mapStateToProps = (state) => {
  return {
    loadedInfo: (state.loading.assessmentDetail.info === loadingStage.Done),
    assessment: state.assessments[state.assessments.selectedAssessment]
  }
}

export default compose(
  connect(mapStateToProps, {load: fetchAssessmentData}),
  LoadComponent
)(AssessmentData)
