import MeetingPoint from '../Attachments/'
import AssessorList from '../AssessorList'
import { Stage, StageDisplayNames } from '../../../constants.js'
import { convertDate } from '../../../utils.js'
var h = require('react-hyperscript')

export const AssessmentData = (props) => {
  let assessment = props.assessment
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
      h(MeetingPoint, {assessee: assessment.assessee, meetingPoint: assessment.data, address: props.address}),
      h('div', '============Assessors================================='),
      h(AssessorList, {
        assessorStages: assessment.assessorStages,
        address: props.address,
        stage: assessment.stage,
        payouts: assessment.payouts
      })
    ])
  )
}

export default AssessmentData
