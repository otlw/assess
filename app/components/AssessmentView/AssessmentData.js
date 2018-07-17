import { Component } from 'react'
import MeetingPointEditBox from './MeetingPoint/'
import AssessorList from './AssessorList.js'
import ProgressButtonBar from './ProgressButtonBar'
import FinalResultBar from './FinalResultBar.js'
import { StageDisplayNames, Stage } from '../../constants.js'
import { convertDate } from '../../utils.js'
import { ViewMeetingPoint } from './MeetingPoint/MeetingPointEditBox.js'
import styled from 'styled-components'
var h = require('react-hyperscript')

export class AssessmentData extends Component {
  render () {
    if (!this.props.assessment) return h('div', 'Loading Data...')
    if (this.props.assessment.invalid) {
      return h('div', 'invalid assessment address!! (maybe you are on the wrong network)')
    } else {
      let assessment = this.props.assessment
      let actionRequired = assessment.stage === assessment.userStage
      let nOtherAssessorsToBeActive = assessment.size - (assessment.stage === Stage.Called ? assessment.assessors.length : assessment.done) - (actionRequired ? 1 : 0)
      let statusString = 'Waiting for ' + (actionRequired ? 'you and ' : '') + nOtherAssessorsToBeActive +
          (nOtherAssessorsToBeActive !== 1 ? ' assessors' : 'assessor') +
          ' to ' + StageDisplayNames[assessment.stage]
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
              h(StatusValue, assessment.stage === Stage.Done ? 'Assessment Complete' : statusString)
            ]),
            h(StatusIndicator, [
              h(StatusKey, assessment.stage === Stage.Done ? 'Completed on: ' : 'Due Date:'),
              h(StatusValue, convertDate(assessment.checkpoint))
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
                h(ViewMeetingPoint, {href: assessment.data, disabled: assessment.data === ''}, 'View'),
                assessment.assessee === this.props.userAddress
                  ? h(MeetingPointEditBox, {
                    assessee: assessment.assessee,
                    address: assessment.address
                  }) // TODO make this appear right of GotoMeetingPointButton
                  : null
              ])
            ]),
            h(AssessorBox, [
              h(AssessorsDone, 'Assessors'),
              h(AssessorList, {assessors: assessment.assessors})
            ])
          ]),
          // progress-buttons
          assessment.stage === Stage.Done
            ? h(FinalResultBar, {
              address: assessment.address,
              userAddress: this.props.userAddress,
              userStage: assessment.userStage,
              assessee: assessment.assessee,
              payout: assessment.payout,
              finalScore: assessment.finalScore,
              cost: assessment.cost
            })
            : h(ProgressButtonBar, {address: assessment.address})
        ])
      )
    }
  }
}

export default AssessmentData

export const SuperFrame = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const Header = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const Role = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const ConceptName = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const SubHeader = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const StatusIndicator = styled('span')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const StatusKey = styled('span')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const StatusValue = styled('span')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const DataBox = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const InfoBox = styled('span')`
  display: inline-block;
  vertical-align:top
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const InfoField = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const InfoKey = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const InfoValue = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const AssessorBox = styled('span')`
  display: inline-block;
  vertical-align:top
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const AssessorsDone = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const AssessorNames = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const MeetingPointButton = styled('button')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
