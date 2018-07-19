import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage, networkName } from '../../../constants.js'

const cardContainer = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4'
})`height: 420px; width: 300px;background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #CFF9EF 85.98%);
`

const cardContainerInfo = styled('div').attrs({
  className: 'flex content-start flex-column w-100 h-50 pa3'
})`
`

const cardTextTitle = styled('div').attrs({
  className: 'flex flex-column tl'
})`
`

const cardTextAssessee = styled('div').attrs({
  className: 'flex flex-column tl mt3'
})`
`

const cardContainerStatus = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100 h-50'
})`background-color: #D3ECF7;
`

const cardTextStatus = styled('div').attrs({
  className: 'flex flex-column h-100 pl3 pa3'
})`
`

const cardContainerProgressBar = styled('div').attrs({
  className: 'absolute flex items-center'
})`right: 8px; top: -12px;
`

const cardProgressBarObject = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 24px; height: 24px;
`

const cardProgressBarObjectActive = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 24px; height: 24px; background-color: #116187;
`

const cardButtonPrimary = styled('div').attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'
})`background-color: #116187;
`

const cardButtonSecondary = styled('div').attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 items-center align-center br-pill dark-blue'
})`box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
`

const ItemFrame = styled('div')`
  border:2px solid ${props => props.userActionRequired ? props.theme.yellow : props.theme.dark};
  padding: 0.5em 1em;
  margin: 0.2em 0;
  background-color:${props => props.theme.light};
  text-align:left;
`

const Box = styled('div')`
  display:inline-block;
  margin-right:3em;
`

const ConceptName = styled('div')`
  color:${props => props.theme.dark};
  font-size:1.8em;
`

const AssesseeAddress = styled('a')`
  color:${props => props.theme.dark};
  font-size:0.8em;
`

// Meeting Point

const MeetingBox = styled('div')`
  background-color:${props => props.theme.veryLight};
  padding: 0.5em 1em;
  display:inline-block;
`
const MeetingCaption = styled('div')`
  color:${props => props.theme.dark};
`
const MeetingAddress = styled('a')`
  color:${props => props.theme.blue};
  font-size:0.8em;
`

// assessee/assessor badges

const AssesseeBadge = styled('div')`
  
`
const AssessorBadge = styled('div')`
  background-color:orange;
  border-radius:0.3em;
  padding:0.1em 0.3em;
`

// link to action/assessmentView

const LinkBox = styled('div')`
  float: right;
  margin-right:1.2em;
`

const LinkUnstyled = styled(Link)`
  text-decoration:none;
`

const LinkButton = styled('div')`
  display:block;
  background-color:green;
  color:${props => props.theme.lightgrey};
  text-decoration:none;
  padding: ${(props) => props.stage === Stage.Done ? '0.5em' : '1em'} 1.5em;
  width:4em;
  text-align:center;
  border: ${(props) => props.userActionRequired ? '1px solid ' + props.theme.yellow : 'none'}
`

const LinkSubtitle = styled('div')`
  color:${props => props.theme.lightgrey};
  font-size:0.6em;
  text-align:center;
`

export class AssessmentItem extends Component {
  render () {
    const assessment = this.props.assessment
    let userStage = assessment.userStage
    let stage = assessment.stage

    // set assessee/assessor view
    let RoleBadge = h(AssessorBadge, 'Assessor')
    let isAssessee = ''
    if (this.props.userAddress === assessment.assessee) {
      RoleBadge = h(AssesseeBadge, 'Assessee')
      isAssessee = ' (you)'
    }

    // set meeting point component
    let MeetingPoint = ' NoMeetingPointSet '
    if (assessment.data) {
      MeetingPoint = h(MeetingAddress, {
        href: assessment.data,
        target: '_blank'
      }, assessment.data)
    }

    // look if user is required to make an action
    let userActionRequired = true
    let actionText = StageDisplayNames[userStage]
    if (stage < userStage ||
      userStage === 0 ||
      userStage === 4 ||
      userStage === 5) {
      userActionRequired = false
    }
    if (stage < userStage) {
      actionText = 'Waiting...'
    } else if (stage === Stage.Done) {
      // if assessment stage is finished, set good message (an assessee would have userStage===0)
      // display score for assessee and payout for assessor
      if (!isAssessee) {
        actionText = h('div', [
          h('div', 'Payout :'),
          h('div', '+5 AHA')
        ])
      } else {
        actionText = h('div', [
          h('div', 'Score :'),
          h('div', assessment.finalScore + ' %')
        ])
      }
    } else if (stage === Stage.Burned) {
      actionText = 'Canceled'
    }
    /* start styling below */
    return (
      h(cardContainer, [
        h(cardContainerInfo, [
          h(cardTextTitle, [
            h('h6', {className: 'f5 mv1 ttu uppercase'}, 'Assessment'),
            h('h3', {className: 'f3 mv1'}, ConceptName, assessment.conceptData)
          ]),
          h(cardTextAssessee, [
            h('h6', {className: 'assessee-title-here f5 mv1 ttu uppercase'}, RoleBadge),
            h('h6', {className: 'assessee-name-here f5 mv1 ttu uppercase'}, 'Antoine Julius')
          ])
        ]),
        h(cardContainerStatus, [
          h(cardContainerProgressBar, {className: 'absolute flex items-center'}, [
            h(cardProgressBarObjectActive, {className: 'flex br-100 w1 h1 bg-light-blue mh1 shadow-4'}),
            h(cardProgressBarObject, {className: 'flex br-100 w1 h1 bg-light-blue mh1 shadow-4'}),
            h(cardProgressBarObject, {className: 'flex br-100 w1 h1 bg-light-blue mh1 shadow-4'}),
            h(cardProgressBarObject, {className: 'flex br-100 w1 h1 bg-light-blue mh1 shadow-4'})
          ]),
          h(cardTextStatus, [
            h('h6', {className: 'f5 tl mv1 ttu uppercase'}, 'Status'),
            h('h6', {className: 'status-message-here f5 tl lh-copy mv1 ttu uppercase'}, 'Waiting for assessors to stake.')
          ]),
          h('div', {className: 'flex flex-row justify-between w-100 pb3 ph3'}, [
            h(cardButtonSecondary, 'Hide'),
            h(cardButtonPrimary, 'Stake')
          ])

        ])
        /* h(MeetingBox, [
          h(MeetingCaption, 'Meet at:'),
          MeetingPoint
        ]
        ) */
        /* h(LinkBox, [
          h(LinkSubtitle, 'click here for details'),
          h(LinkUnstyled, { to: 'assessment/' + assessment.address },
            h(LinkButton, { userActionRequired, stage },
              actionText
            )
          )
        ]) */
      ])
    )
  }
}

export default AssessmentItem
