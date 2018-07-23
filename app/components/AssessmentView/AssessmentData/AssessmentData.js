import { Component } from 'react'
import MeetingPointEditButton from '../Attachments/'
import AssessorList from '../AssessorList'
import ProgressButtonBar from '../ProgressButtonBar'
import { StageDisplayNames } from '../../../constants.js'
import { convertDate } from '../../../utils.js'
import styled from 'styled-components'
import { Header, Role, ConceptName, SubHeader, StatusIndicator, StatusKey, StatusValue, DataBox, InfoField, InfoKey, AssessorBox, InfoBox, InfoValue, AssessorsDone, MeetingPointButton } from './style.js'

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
          h(assessmentHeader, [
            h(assessmentLabelRole, assessment.assessee !== this.props.userAddress ? 'Assessing' : 'Getting assessed in'),
            h(assessmentTextTitle, assessment.conceptData)
          ]),
          // indicates status of assesssment
          h(assessmentRowSubHeader, [
            h(assessmentContainerStatus, [
              h(assessmentLabelBody, 'STATUS'),
              h(assessmentTextBody, statusString)
            ]),
            h(assessmentContainerDate, [
              h(assessmentLabelBody, 'Due Date:'),
              h(assessmentTextBody, convertDate(assessment.endTime))
            ])
          ]),
          // basic info
          h(assessmentContainerBody, [
            h(assessmentColumnLeft, [
              h(assessmentObjectText, [
                h(assessmentLabelBody, 'Assessee'),
                h(assessmentTextBody, assessment.assessee)
              ]),
              h(assessmentObjectText, [
                h(assessmentLabelBody, 'Fee'),
                h(assessmentTextBody, assessment.cost + 'AHA')
              ]),
              h(assessmentObjectText, [
                h(assessmentLabelBody, 'Meeting Point'),
                h(assessmentTextBody, assessment.data || 'You haven\'t set a meeting point'),
                h(assessmentRow, [
                  assessment.data !== ''
                    ? h(fathomButtonPrimary, {href: assessment.data, disabled: assessment.data === ''}, 'View')
                    : null,
                  assessment.assessee === this.props.userAddress
                    ? h(MeetingPointEditButton, {assessee: assessment.assessee})
                    : null
                ])
              ])
            ]),
            h(assessmentColumnRight, [
              h(assessmentObjectTextRight, [
                h(assessmentLabelBody, 'Assessors'),
                h(assessmentObjectText)
              ])
            ])
          ]),
          // progress-buttons
          h(assessmentFooter, [
            h(ProgressButtonBar)
          ])
        ])
      )
    } else {
      return h('div', 'Loading Data')
    }
  }
}

const SuperFrame = styled('div').attrs({className: 'flex flex-column w-100 mw8 bg-white shadow-4'})`
font-family:'system-ui',sans-serif;
`

const assessmentHeader = styled('div').attrs({className: 'flex flex-column w-100 pv4 ph3 bg-lightest-blue'})`
`

const assessmentLabelRole = styled('h6').attrs({className: 'f6 tl ttu uppercase dark-blue mv0 fw4'})`
`

const assessmentTextTitle = styled('h2').attrs({className: 'f2 tl ttu uppercase dark-blue mt2 mb0 fw4'})`
`

const assessmentRowSubHeader = styled('div').attrs({className: 'flex flex-row w-100 items-center bt bb b--gray'})`
`

const assessmentContainerStatus = styled('div').attrs({className: 'flex flex-row w-50 items-center justify-between pa3'})`
`

const assessmentLabelBody = styled('h6').attrs({className: 'f6 mid-gray mv0 fw4 ttu uppercase'})`
`

const assessmentTextBody = styled('h5').attrs({className: 'f5 gray mt2 mb0 fw4 gray'})`
`

const assessmentContainerDate = styled('div').attrs({className: 'flex flex-row w-50 items-center justify-between pa3 bl b--gray'})`
`

const assessmentContainerBody = styled('div').attrs({className: 'flex flex-row w-100 items-center justify-between'})`
`

const assessmentColumnLeft = styled('div').attrs({className: 'flex flex-column w-50 items-around justify-around pa3'})`
`

const assessmentObjectText = styled('div').attrs({className: 'flex flex-column w-100  items-start justify-center self-start mv3'})`
`

const assessmentObjectTextRight = styled('div').attrs({className: 'flex flex-column w-100  items-end justify-center self-start mv3'})`
`

const assessmentListAssessors = styled('div').attrs({className: 'flex flex-column w-100 h-100 self-start  items-start justify-center self-start mv3'})`
`

const assessmentColumnRight = styled('div').attrs({className: 'flex flex-column w-50 h-100 self-start items-start justify-around pa3'})`
`

const assessmentRow = styled('div').attrs({className: 'flex flex-row w-100 mw5 justify-between mt3 '})`
`

const fathomButtonPrimary = styled('button').attrs({className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'})`
`

const assessmentFooter = styled('div').attrs({className: 'flex flex-row w-100'})`
`

export default AssessmentData
