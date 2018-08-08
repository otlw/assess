import { Component } from 'react'
import MeetingPointEditBox from './MeetingPoint/'
import AssessorList from './AssessorList.js'
import ProgressAndInputBar from './ProgressAndInputBar'
import FinalResultBar from './FinalResultBar.js'
import { StageDisplayNames, Stage } from '../../constants.js'
import { convertDate } from '../../utils.js'
// Do we still need this? -> import { ViewMeetingPoint } from './MeetingPoint/MeetingPointEditBox.js'
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
          h(assessmentHeader, [
            h(assessmentLabelRole, assessment.assessee !== this.props.userAddress ? 'Assessing' : 'Getting assessed in'),
            h(assessmentTextTitle, assessment.conceptData)
          ]),
          // indicates status of assesssment
          h(assessmentRowSubHeader, [
            h(assessmentContainerStatus, [
              h(assessmentLabelBody, 'STATUS'),
              h(assessmentTextBody, assessment.stage === Stage.Done ? 'Assessment Complete' : statusString)
            ]),
            h(assessmentContainerDate, [
              h(assessmentLabelBody, assessment.stage === Stage.Done ? 'Completed on: ' : 'Due Date:'),
              h(assessmentTextBody, convertDate(assessment.checkpoint))
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
                h(assessmentTextBody, Math.round(assessment.cost / 1e9) + 'AHA')
              ]),
              h(assessmentObjectText, [
                h(assessmentLabelBody, 'Meeting Point'),
                h(assessmentTextBody, assessment.data || 'You haven\'t set a meeting point'),
                h(assessmentRow, [
                  h(fathomButtonPrimary, {href: assessment.data, disabled: assessment.data === ''}, 'View'),
                  assessment.assessee === this.props.userAddress
                    ? h(MeetingPointEditBox, { // same here ALEX
                      assessee: assessment.assessee,
                      address: assessment.address
                    })
                    : null
                ])
              ])
            ]),
            h(assessmentColumnRight, [
              h(assessmentObjectTextRight, [
                h(assessmentLabelBody, 'Assessors'),
                h(assessmentObjectText, [
                  h(AssessorList, {assessors: assessment.assessors}) // ALEX, i meddled here
                ])
              ])
            ])
          ]),
          // progress-button or FinalResultBor
          h(assessmentFooter, [
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
              : h(ProgressAndInputBar, {address: assessment.address})
          ])
        ])
      )
    }
  }
}

export default AssessmentData

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

const assessmentTextBody = styled('h5').attrs({className: 'f5 gray mv2 mb0 fw4 gray'})`
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

// Commented out as we may need to re-implement this very soon
// const assessmentListAssessors = styled('div').attrs({className: 'flex flex-column w-100 h-100
// self-start  items-start justify-center self-start mv3'})``

const assessmentColumnRight = styled('div').attrs({className: 'flex flex-column w-50 h-100 self-start items-start justify-around pa3'})`
`

const assessmentRow = styled('div').attrs({className: 'flex flex-row w-100 mw5 justify-between mt3 '})`
`

const fathomButtonPrimary = styled('button').attrs({className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'})`
`

const assessmentFooter = styled('div').attrs({className: 'flex flex-row w-100'})`
`
