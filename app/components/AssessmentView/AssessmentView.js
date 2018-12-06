import { Component } from 'react'
import MeetingPoint from './MeetingPoint'
import AssessorList from './AssessorList.js'
import ProgressAndInputBar from './ProgressAndInputBar'
import FinalResultBar from './FinalResultBar.js'
import FailedBar from './FailedBar'
import { Stage, HelpTexts } from '../../constants.js'
import { convertDate, statusMessage, mapAssessmentStageToStep } from '../../utils.js'
import styled from 'styled-components'
import progressDots from '../Global/progressDots.ts'
import { Headline, Label, Body } from '../Global/Text.ts'
import { ButtonHelp } from '../Global/Buttons'
import { LinkClose } from '../Global/Links'
import { helperBarTopic } from '../../components/Helpers/helperContent'

var h = require('react-hyperscript')

export class AssessmentData extends Component {
  componentDidMount () {
    if (this.props.assessment && !this.props.assessment.invalid) {
      let props = this.props
      // let visits = props.visits
      setInterval(()=>{
        console.log('props.userStage, assessmentView setInterval',props.userStage)
      },3000)
      let userActionRequired = props.userStage === props.assessment.stage
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

  componentWillUnmount () {
    this.props.setHelperBar(null)
  }

  render () {
    if (!this.props.assessment) return h('div', 'Loading Data...')
    if (this.props.assessment.invalid) return h('div', 'invalid assessment address!! you may be on the wrong network')
    let isAssessee = this.props.assessment.assessee === this.props.userAddress
    let status = statusMessage(isAssessee, this.props.assessment, this.props.transactions)
    if (this.props.assessment.refunded && !this.props.assessment.cost) {
      // this means the assessment was reconstructed
      return h('div', status)
    }
    let assessment = this.props.assessment
    // return (
    return h(viewContainer, [
      h(containerLinkClose, [
        h(LinkClose, {to: '/'})
      ]),
      h(SuperFrame, [
        // holds role and concept title
        h(assessmentHeader, [
          h(Label, isAssessee ? 'Getting assessed in' : 'Assessing'),
          h(Headline, assessment.conceptData.name)
        ]),
        // indicates status of assesssment
        h(assessmentRowSubHeader, [
          h(assessmentContainerStatus, [
            h(assessmentLabelContainer, [
              h(Label, 'STATUS'),
              h(progressDots, {
                length: 4,
                // reajust because progressDots index starts at zero
                step: assessment.violation ? assessment.violation : mapAssessmentStageToStep(assessment.stage) - 1,
                failed: assessment.violation > 0 || false
              })
            ]),
            h(Body, status)
          ]),
          h(assessmentContainerDate, [
            h(assessmentLabelContainer, [
              h(Label, assessment.stage === Stage.Done ? 'Completed on: ' : 'Due Date:')
            ]),
            h(Body, convertDate(assessment.checkpoint))
          ])
        ]),
        // basic info
        h(assessmentContainerBody, [
          h(assessmentObjectText, [
            h(assessmentLabelContainer, [
              h(Label, 'Assessee'),
              h(ButtonHelp, {text: HelpTexts.assessee})
            ]),
            h(Body, isAssessee ? 'You' : assessment.assessee)
          ]),
          h(assessmentObjectTextRight, [
            h(assessmentLabelContainer, [
              h(Label, 'Assessors'),
              h(ButtonHelp, {text: HelpTexts.assessors})
            ]),
            h(AssessorList, {
              assessors: assessment.assessors,
              userAddress: this.props.userAddress
            })
          ]),
          h(assessmentObjectText, [
            h(MeetingPoint, {assessment: assessment, isAssessee: isAssessee})
          ]),
          h(assessmentObjectTextRight, [
            h(assessmentLabelContainer, [
              h(Label, 'Fee')
            ]),
            h(Body, assessment.cost + ' AHA')
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
    ])
    // )
  }
}

export default AssessmentData

const viewContainer = styled('div').attrs({className: 'relative flex flex-column w-100 h-100'})``

const SuperFrame = styled('div').attrs({className: 'flex flex-column w-100 mw8 self-center mt3 br2 shadow-4'})`
font-family:'system-ui',sans-serif;
max-width: 800px;
position:relative;
`

// assessmentView Header

const assessmentHeader = styled('div').attrs({className: 'flex flex-column w-100 pv3 ph3 br2 br--top truncate ellipsis'})`
background-color: ${props => props.theme.tertiary};
`

const assessmentRowSubHeader = styled('div').attrs({className: 'flex flex-row w-100 items-center justify-between pt4 pb3 ph3'})`
background-color: ${props => props.theme.tertiary};
`

const assessmentContainerStatus = styled('div').attrs({className: 'flex flex-row flex-wrap w-50 items-center justify-start '})`
`

export const assessmentLabelContainer = styled('div').attrs({className: 'flex flex-row w-100 mb2 items-center justify'})`
`

// End assessmentView Header

const assessmentContainerDate = styled('div').attrs({className: 'flex flex-column w-40 items-start justify-between '})`
`

const assessmentContainerBody = styled('div').attrs({className: 'flex flex-row flex-wrap w-100 items-center justify-between ph3'})`
background-color: ${props => props.theme.bgSecondary};
`

const assessmentObjectText = styled('div').attrs({className: 'flex flex-column w-50  items-start justify-center self-start mv4'})`
`

const assessmentObjectTextRight = styled('div').attrs({className: 'flex flex-column w-40  items-start justify-center self-start mv4'})`
`

const assessmentFooter = styled('div').attrs({className: 'relative flex flex-row w-100'})`
margin-top:1px;
background-color: ${props => props.theme.bgSecondary};
`

const containerLinkClose = styled('div').attrs({className: 'relative flex w-100 justify-end'})``
