import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage } from '../constants.js'

export class AssessmentCard extends Component {
  render () {
    const assessment = this.props.assessment
    let userStage = assessment.userStage
    let stage = assessment.stage

    // set assessee/assessor view
    let isAssessee = false
    if (this.props.userAddress === assessment.assessee) {
      isAssessee = true
    }

    let actionRequired = stage === userStage
    let nOtherAssessorsToBeActive = assessment.size - assessment.done - (actionRequired ? 1 : 0)
    let status = 'Waiting for ' + (actionRequired ? 'you and ' : '') + nOtherAssessorsToBeActive + ' assessors to ' + StageDisplayNames[stage]

    if (stage < userStage) {
      status = 'Waiting...'
    } else if (stage === Stage.Done) {
      // if assessment stage is finished, set good message (an assessee would have userStage===0)
      // display score for assessee and payout for assessor
      if (!isAssessee) {
        let gain = this.props.assessment.payout - this.props.assessment.cost
        status = h('div', [
          h('div', 'Payout :'),
          h('div', (gain >= 0 ? '+' : '-') + gain.toString() + ' AHA')
        ])
      } else {
        status = h('div', [
          h('div', 'Score :'),
          h('div', assessment.finalScore + ' %')
        ])
      }
    } else if (stage === Stage.Burned) {
      status = 'Canceled'
    }

    /* start styling below */
    return (
      h(cardContainer, [
        h(cardContainerInfo, [
          h(cardTextObject, [
            h(cardTextTitle, 'Assessment'),
            h(ConceptName, assessment.conceptData.name)
          ]),
          h(cardTextObject, [
            h(cardLabel, 'Assessee'),
            h(cardTextAssessee, isAssessee ? 'You' : assessment.assessee.substring(0, 8) + '...')
          ])
        ]),
        h(cardContainerStatus, [
          h(cardContainerProgressBar, [
            h(stage > 0 ? cardProgressBarObjectComplete : (stage === 0 || stage === 1) ? cardProgressBarObjectActive : cardProgressBarObjectInactive),
            h(stage > 1 ? cardProgressBarObjectComplete : stage === 2 ? cardProgressBarObjectActive : cardProgressBarObjectInactive),
            h(stage > 2 ? cardProgressBarObjectComplete : stage === 3 ? cardProgressBarObjectActive : cardProgressBarObjectInactive),
            h(stage > 3 ? cardProgressBarObjectComplete : stage === 4 ? cardProgressBarObjectActive : cardProgressBarObjectInactive)
          ]),
          h(cardTextStatus, [
            h(cardLabel, 'Status'),
            h(cardTextStatusMsg, status)
          ]),
          h('div', {className: 'flex flex-row justify-between w-100 pb3 ph3'}, [
            h(cardButtonSecondary, 'Hide'),
            h(cardButtonPrimary, { to: '/assessment/' + assessment.address }, userStage === Stage.None ? 'View' : StageDisplayNames[stage])
          ])
        ])
      ])
    )
  }
}

export default AssessmentCard

// styles
const cardContainer = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4'
})`height: 420px; width: 300px;background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #CFF9EF 85.98%);
`

const cardContainerInfo = styled('div').attrs({
  className: 'flex justify-between flex-column w-100 pa3'
})`
height: 60%;
`

const cardTextObject = styled('div').attrs({
  className: 'flex flex-column tl'
})`
`

const cardTextTitle = styled('div').attrs({
  className: 'f5 fw4 mv1 ttu uppercase'
})`
color: #0A4A66;
`

const cardLabel = styled('div').attrs({
  className: 'f5 fw4 mv1 ttu uppercase'
})`
color: #0A4A66;
`

const cardTextAssessee = styled('div').attrs({
  className: 'f5 fw4 mv1 ttu uppercase truncate w4 ellipsis'
})`
color: #117099;
`

const cardContainerStatus = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100'
})`
height: 40%;
background-color: #D3ECF7;
`

const cardTextStatus = styled('div').attrs({
  className: 'flex flex-column h-100 pl3 pa3'
})`
`

const cardContainerProgressBar = styled('div').attrs({
  className: 'absolute flex items-center'
})`right: 16px; top: -8px;
`

const cardProgressBarObjectInactive = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 20px; height: 20px;
`

const cardProgressBarObjectActive = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 20px; height: 20px; background-color: #52A7CC;
`
const cardProgressBarObjectComplete = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 20px; height: 20px; background-color: #52CC91;
`

const cardTextStatusMsg = styled('div').attrs({
  className: 'f5 fw4 mv1'
})`
color: #117099;
`

const cardButtonPrimary = styled(Link).attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'
})`background-color: #116187;text-decoration:none;
`

const cardButtonSecondary = styled('div').attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 items-center align-center br-pill dark-blue'
})`box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
`

const ConceptName = styled('h2').attrs({
  className: 'f2 fw4 mv1'
})`
  color:${props => props.theme.dark};
`
