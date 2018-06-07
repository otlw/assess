import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const ItemFrame = styled('div')`
  border:2px solid ${props => props.active ? props.theme.yellow : props.theme.dark};
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

//Meeting Point

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

//assessee/assessor badges

const AssesseeBadge= styled('div')`
  background-color:blue;
  border-radius:0.3em;
  padding:0.1em 0.3em;
`
const AssessorBadge= styled('div')`
  background-color:orange;
  border-radius:0.3em;
  padding:0.1em 0.3em;
`

//link to action/assessmentView

const LinkBox = styled('div')`
  float: right;
  margin-right:1.2em;
  //margin-top:0.5em;
`
const LinkButton = styled(Link)`
  display:block;
  background-color:green;
  color:${props => props.theme.dark};
  text-decoration:none;
  padding: 1em 1.5em;
  width:4em;
  text-align:center;
  border: ${(props) => props.active ? '1px solid '+props.theme.yellow : 'none'}
`

const LinkSubtitle= styled('div')`
  color:${props => props.theme.lightgrey};
  font-size:0.6em;
  text-align:center;
`

export class AssessmentItem extends Component {
  render () {
    const assessment = this.props.assessment

    //set assessee/assessor view
    let RoleBadge=h(AssessorBadge,"Assessor")
    let isAssessee= ""
    if (this.props.userAddress===assessment.assessee){
      RoleBadge=h(AssesseeBadge,"Assessee")
      isAssessee=" (you)"
    }
    if (assessment.stage===0){
      RoleBadge=null
    }

    //set meeting point component
    let MeetingPoint= ' NoMeetingPointSet '
    if (assessment.data){
      MeetingPoint=h(MeetingAddress, {
                href: assessment.data,
                target: '_blank'
      }, assessment.data)
    }

    //look if user is required to make an action
    let active=true
    let actionTexts={
      0:"On going",
      1:"Stake",
      2:"Commit",
      3:"Reveal",
      4:"Done",
      5:"Burned"
    }
    let actionText=actionTexts[assessment.userStage]
    if (assessment.stage<assessment.userStage
      ||assessment.userStage===0
      ||assessment.userStage===4
      ||assessment.userStage===5){
      active=false
    }
    if (assessment.stage<assessment.userStage){
      actionText="Waiting..."
    }
    if (assessment.stage===4){
      actionText="Done"
    }
    if (assessment.stage===5){
      actionText="Burned"
    }

    return (
      h(ItemFrame,{active}, [
        h(Box, [
          h(ConceptName, assessment.conceptData),
          h(AssesseeAddress, {
            href: 'https://' + (this.props.networkID === 4 ? 'rinkeby.' : '') + 'etherscan.io/address/' + assessment.assessee,
            target: '_blank'
          }, 'assessee: ' + assessment.assessee.substring(0, 8) + '...' + assessment.assessee.substring(30, 42) + isAssessee)
        ]),
        h(Box, [
          RoleBadge
        ]),
        h(MeetingBox,[
            h(MeetingCaption,"Meet Assessee at:"),
            MeetingPoint
          ]
        ),
        h(LinkBox,[
          h(LinkSubtitle,"click here for details"),
          h(LinkButton,{to:'assessment/' + assessment.address,active},actionText)
        ])
      ])
    )
  }
}

export default AssessmentItem
