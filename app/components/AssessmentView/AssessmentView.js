import { Component } from 'react'
import MeetingPointEditBox from './MeetingPoint/'
import AssessorList from './AssessorList.js'
import ProgressAndInputBar from './ProgressAndInputBar'
import FinalResultBar from './FinalResultBar.js'
import FailedBar from './FailedBar'
import { Stage } from '../../constants.js'
import { convertDate, statusMessage } from '../../utils.js'
import styled from 'styled-components'
import { helperBarTopic } from '../../components/Helpers/helperContent'
var h = require('react-hyperscript')

export class AssessmentData extends Component {
  componentDidMount () {
    if (this.props.assessment && !this.props.assessment.invalid) {
      let props = this.props
      // let visits = props.visits
      let userActionRequired = props.assessment.userStage === props.assessment.stage
      if (userActionRequired) {
        switch (props.assessment.userStage) {
          case Stage.Called:
            props.setHelperBar(helperBarTopic.Staking)
            break
          case Stage.Confirmed:
            props.setHelperBar('Committing')
            break
          case Stage.Commited:
            props.setHelperBar('Revealing')
            break
          default: break
        }
      }
    }
  }

  render () {
    if (!this.props.assessment) return h('div', 'Loading Data...')
    if (this.props.assessment.invalid) return h('div', 'invalid assessment address!! you may be on the wrong network')
    let isAssessee = this.props.assessment.assessee === this.props.userAddress
    let status = statusMessage(isAssessee, this.props.assessment)
    if (this.props.assessment.refunded && !this.props.assessment.cost) {
      // this means the assessment was reconstructed
      return h('div', status)
    }
    let assessment = this.props.assessment
    return (
      h(SuperFrame, [
        // holds role and concept title
        h(assessmentHeader, [
          h(assessmentLabelActivity, isAssessee ? 'Getting assessed in' : 'Assessing'),
          h(assessmentTextTitle, assessment.conceptData.name),
          // indicates status of assesssment
          h(assessmentRowSubHeader, [
            h(assessmentContainerStatus, [
              h(assessmentContainerStatusIndicator, [
                h(assessmentLabelStatus, 'STATUS'),
                h(assessmentIndicatorActive),
                h(assessmentIndicatorInactive),
                h(assessmentIndicatorInactive),
                h(assessmentIndicatorInactive)
              ]),
              h(assessmentTextBody, status)
            ]),
            h(assessmentContainerDate, [
              h(assessmentLabelBody, assessment.stage === Stage.Done ? 'Completed on: ' : 'DEADLINE'),
              h(assessmentTextBody, convertDate(assessment.checkpoint))
            ])
          ])
        ]),
        // basic info
        h(assessmentContainerBody, [
          h(assessmentObjectText, [
            h(assessmentLabelBody, 'Assessee'),
            h(assessmentTextAddress, isAssessee ? 'You' : assessment.assessee)
          ]),
          h(assessmentObjectTextRight, [
            h(assessmentLabelBody, 'Assessors'),
            h(AssessorList, {
              assessors: assessment.assessors,
              userAddress: this.props.userAddress
            })
          ]),
          h(assessmentObjectText, [
            h(assessmentLabelBody, 'Meeting Point'),
            h(assessmentTextBody, [
              assessment.data
                ? h('a', {href: assessment.data}, assessment.data)
                : isAssessee
                  ? 'You haven\'t set a meeting point'
                  : 'No meeting point has been set yet']),
            h(assessmentRow, [
              assessment.assessee === this.props.userAddress
                ? h(MeetingPointEditBox, {
                  assessee: assessment.assessee,
                  assessmentAddress: assessment.address
                })
                : null
            ])
          ]),
          h(assessmentObjectTextRight, [
            h(assessmentLabelBody, 'Fee'),
            h(assessmentTextBody, assessment.cost + ' AHA')
          ])
        ]),
        // progress-button, FinalResultBor or FailureIndicator
        h(assessmentFooter, [
          // if failed
          assessment.violation
            ? h(FailedBar, {
              assessment: assessment,
              userAddress: this.props.userAddress
            })
            // if completed
            : assessment.stage === Stage.Done
              ? h(FinalResultBar, {
                assessmentAddress: assessment.address,
                userAddress: this.props.userAddress,
                userStage: assessment.userStage,
                assessee: assessment.assessee,
                payout: assessment.payout,
                finalScore: assessment.finalScore,
                cost: assessment.cost
              })
              // regular ProgressBar
              : h(ProgressAndInputBar, {assessmentAddress: assessment.address})
        ])
      ])
    )
  }
}

export default AssessmentData

const SuperFrame = styled('div').attrs({className: 'flex flex-column w-100 mw8 self-center mt3 br2 shadow-4'})`
font-family:'system-ui',sans-serif;
max-width: 800px;
`

// assessmentView Header

const assessmentHeader = styled('div').attrs({className: 'flex flex-column w-100 pv3 ph3 br2 br--top'})`
background-color: ${props => props.theme.tertiary};
`

const assessmentLabelActivity = styled('h6').attrs({className: 'f5 tl ttu uppercase mv0 fw4'})`
color: ${props => props.theme.primary};
`

const assessmentTextTitle = styled('h2').attrs({className: 'f2 tl dark-blue mt2 mb0 fw4'})`
color: ${props => props.theme.primary};
`

const assessmentRowSubHeader = styled('div').attrs({className: 'flex flex-row w-100 items-center justify-between mt5'})`
`

const assessmentContainerStatus = styled('div').attrs({className: 'flex flex-row flex-wrap w-50 items-start justify-between '})`
`

// assessmentView Header
//  ->  Status Indicator

const assessmentContainerStatusIndicator = styled('div').attrs({className: 'flex flex-row w-100 items-center'})`
`

const assessmentIndicatorInactive = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.primary};
`

const assessmentIndicatorActive = styled('div').attrs({className: 'flex ba br-100 mh2'})`
height: 10px;
width: 10px;
color: ${props => props.theme.primary};
background: ${props => props.theme.primary};
`

const assessmentLabelStatus = styled('h6').attrs({className: 'f5 w-auto mr2 mv0 fw4 tl ttu uppercase'})`
color: ${props => props.theme.primary};
`

// End Status Indicator
// End assessmentView Header

const assessmentLabelBody = styled('h6').attrs({className: 'f5 w-100 mv0 fw4 tl ttu uppercase'})`
color: ${props => props.theme.primary};
`

const assessmentTextBody = styled('h5').attrs({className: 'f5 gray mv2 mb0 fw4'})`
color: ${props => props.theme.textBody};
`

const assessmentTextAddress = styled('h5').attrs({className: 'f5 gray mv2 mb0 fw4 gray w-50 truncate ellipsis'})`
`

const assessmentContainerDate = styled('div').attrs({className: 'flex flex-column w-40 items-start justify-between '})`
`

const assessmentContainerBody = styled('div').attrs({className: 'flex flex-row flex-wrap w-100 items-center justify-between ph3'})`
background-color: ${props => props.theme.bgSecondary};
`

const assessmentObjectText = styled('div').attrs({className: 'flex flex-column w-50  items-start justify-center self-start mv4'})`
`

const assessmentObjectTextRight = styled('div').attrs({className: 'flex flex-column w-40  items-start justify-center self-start mv4'})`
`

// Commented out as we may need to re-implement this very soon
// const assessmentListAssessors = styled('div').attrs({className: 'flex flex-column w-100 h-100
// self-start  items-start justify-center self-start mv3'})``

const assessmentRow = styled('div').attrs({className: 'flex flex-row w-100 mw5 justify-between mt3 '})`
`

const assessmentFooter = styled('div').attrs({className: 'relative flex flex-row w-100'})`
margin-top:1px;
background-color: ${props => props.theme.bgSecondary};
`
