import { Component } from 'react'
import MeetingPointEditButton from '../Attachments/'
import AssessorList from '../AssessorList'
import ProgressButtonBar from '../ProgressButtonBar'
import { StageDisplayNames } from '../../../constants.js'
import { convertDate } from '../../../utils.js'
import { SuperFrame, Header, Role, ConceptName, SubHeader, StatusIndicator, StatusKey, StatusValue, DataBox, InfoField, InfoKey, AssessorBox, InfoBox, InfoValue, AssessorsDone, MeetingPointButton } from './style.js'

var h = require('react-hyperscript')

export class AssessmentData extends Component {
  render () {
    if (this.props.invalidAssessment) {
      return h('div', 'invalid assessment address!! (maybe you are on the wrong network)')
    }
    if (this.props.loadedInfo) {
      let assessment = this.props.assessment
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
                h(InfoValue, assessment.data || '< no meeting point set >'),
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
        ])
      )
    } else {
      return h('div', 'Loading Data')
    }
  }
}

export default AssessmentData
