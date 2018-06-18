import { Component } from 'react'
import MeetingPoint from '../Attachments/'
import AssessorList from '../AssessorList'
import { Stage, StageDisplayNames } from '../../../constants.js'
import { convertDate } from '../../../utils.js'
var h = require('react-hyperscript')

export class AssessmentData extends Component {
  render () {
    if (this.props.invalidAssessment) {
      return h('div', 'invalid assessment address!! (maybe you are on the wrong network)')
    }
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
          assessment.stage === Stage.Called
            ? (h('div', [
              h('span', 'Staking period expires: '),
              h('span', convertDate(assessment.checkpoint))
            ]))
            : null,
          h('div', [
            h('span', 'Assessment end: '),
            h('span', convertDate(assessment.endTime))
          ]),
          h('div', [
            h('span', 'Size: '),
            h('span', assessment.size)
          ]),
          h('div', [
            h('span', 'Stage: '),
            h('span', StageDisplayNames[assessment.stage]),
            h('span', ' (' + assessment.stage + '/4)')
          ]),
          // display final score only if assessment is done
          (assessment.stage === 4
            ? h('div', [h('span', 'final Score: '),
              (assessment.finalScore > 50
                ? h('span', { style: { 'color': '#2f2' } }, 'Pass')
                : h('span', { style: { 'color': '#f22' } }, 'Fail')),
              h('span', ' (' + assessment.finalScore + ' out of 100)')])
            : null),
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

export default AssessmentData
