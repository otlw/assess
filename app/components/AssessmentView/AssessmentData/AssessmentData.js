import { Component } from 'react'
import MeetingPointEditButton from '../Attachments/'
import AssessorList from '../AssessorList'
import ProgressButtonBar from '../ProgressButtonBar'
import { Stage, StageDisplayNames } from '../../../constants.js'
import { convertDate } from '../../../utils.js'
import { SuperFrame, Header, Role, ConceptName, SubHeader, StatusIndicator, StatusKey, StatusValue, DataBox, InfoField, InfoKey, AssessorBox, InfoBox, InfoValue, AssessorNames, AssessorsDone, ProgressButtonBox, MeetingPointButton } from './style.js'

var h = require('react-hyperscript')

export class AssessmentData extends Component {
  render () {
    if (this.props.invalidAssessment) {
      return h('div', 'invalid assessment address!! (maybe you are on the wrong network)')
    }
    if (this.props.loadedInfo) {
      let assessment = this.props.assessment
      console.log('assesment;,', assessment.data === '')
      let actionRequired = assessment.stage === assessment.userStage
      let nOtherAssessorsToBeActive = assessment.size - assessment.done - (actionRequired ? 1 : 0)
        let statusString = 'Waiting for ' + (actionRequired ? 'you and ' : '') + nOtherAssessorsToBeActive + ' assessors to ' + StageDisplayNames[assessment.stage]
      return (
        h(SuperFrame, [
          // holds role and concept title
          h(Header, [
            h(Role, assessment.assessee !== this.props.userAddress ? 'Assessing' : 'Getting assessed in'),
            h(ConceptName, assessment.conceptData)
          ]),
          // indicates status of assesssment
          h(SubHeader, [
            h(StatusIndicator, [
              h(StatusKey, 'STATUS'),
              h(StatusValue, statusString)
            ]),
            h(StatusIndicator, [
              h(StatusKey, 'Due Date:'),
              h(StatusValue, convertDate(assessment.endTime))
            ])
          ]),
          // basic info
          h(DataBox, [
            h(InfoBox, [
              h(InfoField, [
                h(InfoKey, 'Assessee'),
                h(InfoValue, assessment.assessee)
              ]),
              h(InfoField, [
                h(InfoKey, 'Fee'),
                h(InfoValue, assessment.cost + 'AHA')
              ]),
              h(InfoField, [
                h(InfoKey, 'Meeting Point'),
                h(InfoValue, assessment.data),
                h(MeetingPointButton, {href: assessment.data, disabled: assessment.data === ''}, 'View'),
                assessment.assessee === this.props.userAddress
                  ? h(MeetingPointEditButton, {className: MeetingPointButton, assessee: assessment.assessee}) // TODO make this appear right of GotoMeetingPointButton
                  : null
              ])
            ]),
            h(AssessorBox, [
              h(AssessorsDone, 'Assessors'),
              h(AssessorList)
            ])
          ]),
          // progress-buttons
          h(ProgressButtonBar)
          // h(ProgressButtonBox, [
          //   h('span', {style: {'border': '2px solid'}}, 'Stake'),
          //   h('span', {style: {'border': '2px solid'}}, 'Commit'),
          //   h('span', {style: {'border': '2px solid'}}, 'Reveal')
          //   // h(StakeButton), // TODO
            // h(CommitButton),
            // h(RevealButton)
          // ])
        ])
      )
      /*
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
      */
    } else {
      return h('div', 'Loading Data')
    }
  }
}

export default AssessmentData
