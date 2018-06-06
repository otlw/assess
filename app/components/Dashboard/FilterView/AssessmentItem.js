import { Component } from 'react'
import h from 'react-hyperscript'
// import {Link} from 'react-router-dom'
// import { stages } from '../../../constants.js'
import styled from 'styled-components'

// import MeetingPoint from '../../AssessmentView/Attachments/'

const itemFrame = styled('div')`
  border:2px solid ${props => props.theme.dark};
  padding: 0.2em 0.5em;
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
  padding: 0.3em 1em;
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

export class AssessmentItem extends Component {
  render () {
    const assessment = this.props.assessment
    console.log(assessment)

    //set assessee/assessor view
    let RoleBadge=h(AssessorBadge,"Assessor")
    let isAssessee= ""
    if (this.props.userAddress===assessment.assessee){
      RoleBadge=h(AssesseeBadge,"Assessee")
      isAssessee=" (you)"
    }
    if (assessment.stage===0){
      RoleBadge=null
      //isAssessee=""
    }

    //set meeting point component
    let MeetingPoint= ' NoMeetingPointSet '
    if (assessment.data){
      MeetingPoint=h(MeetingAddress, {
                href: assessment.data,
                target: '_blank'
      }, assessment.data)
    }
    return (
      h(itemFrame, [
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
        )
      ])
    )
  }
}

// h('br'),
// h('div', itemStyle.titleStyle, 'in: ' + assessment.conceptData),
// h(Link,
//   {to: 'assessment/' + assessment.address},
//   'at: ' + assessment.address.substring(0, 5) + '...' + assessment.address.substring(37)),
// h('div', [
//   h('span', itemStyle.titleStyle, 'Stage: '),
//   h('span', stages[assessment.stage])
// ]),
// h('div', [
//   h('span', itemStyle.titleStyle, 'Role: '),
//   h('span', assessment.assessee === this.props.userAddress ? 'Assessee' : 'Assessor')
// ]),
// h('br')

export default AssessmentItem
