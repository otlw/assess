import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage, networkName } from '../../../constants.js'

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
  background-color:${props => props.theme.lightblue};
  border-radius:0.3em;
  padding:0.1em 0.3em;
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
        let gain = this.props.assessment.payouts[this.props.userAddress] - this.props.assessment.cost
        actionText = h('div', [
          h('div', 'Payout :'),
          h('div', (gain >= 0 ? '+' : '-') + gain.toString() + ' AHA')
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
    return (
      h(ItemFrame, {userActionRequired}, [
        h(Box, [
          h(ConceptName, assessment.conceptData),
          h(AssesseeAddress, {
            href: 'https://' + (networkName(this.props.networkID) === 'Mainnet' ? '' : networkName(this.props.networkID) + '.') + 'etherscan.io/address/' + assessment.assessee,
            target: '_blank',
            title: 'est'
          }, 'assessee: ' + assessment.assessee.substring(0, 8) + '...' + assessment.assessee.substring(30, 42) + isAssessee)
        ]),
        h(Box, [
          RoleBadge
        ]),
        h(MeetingBox, [
          h(MeetingCaption, 'Meet at:'),
          MeetingPoint
        ]
        ),
        h(LinkBox, [
          h(LinkSubtitle, 'click here for details'),
          h(LinkUnstyled, { to: 'assessment/' + assessment.address },
            h(LinkButton, { userActionRequired, stage },
              actionText
            )
          )
        ])
      ])
    )
  }
}

export default AssessmentItem
