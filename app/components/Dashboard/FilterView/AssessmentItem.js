import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import { StageDisplayNames, Stage } from '../../../constants.js'

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

const cardProgressBarObjectInactive = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 24px; height: 24px;
`

const cardProgressBarObjectActive = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 24px; height: 24px; background-color: #52A7CC;
`
const cardProgressBarObjectComplete = styled('div').attrs({
  className: 'flex br-100 w2 h2 bg-light-blue mh1 shadow-4'
})`width: 24px; height: 24px; background-color: #52CC91;
`

const cardButtonPrimary = styled(Link).attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'
})`background-color: #116187;text-decoration:none;
`

const cardButtonSecondary = styled('div').attrs({
  className: 'flex self-end ph4 pv2 fw4 f5 items-center align-center br-pill dark-blue'
})`box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
`

const ConceptName = styled('h3')`
  color:${props => props.theme.dark};
  font-size:1.8em;
`

const AssesseeBadge = styled('div')` 
`

export class AssessmentItem extends Component {
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
        status = h('div', [
          h('div', 'Payout :'),
          h('div', '+5 AHA')
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
          h(cardTextTitle, [
            h('h6', {className: 'f5 mv1 ttu uppercase'}, 'Assessment'),
            h(ConceptName, {className: 'f3 mv1'}, assessment.conceptData)
          ]),
          h(cardTextAssessee, [
            h('h6', {className: 'assessee-title-here f5 mv1 ttu uppercase'}, h(AssesseeBadge, 'Assessee')),
            h('h6', {className: 'assessee-name-here f5 mv1 ttu uppercase'}, isAssessee ? 'You' : assessment.assessee.substring(0, 8) + '...')
          ])
        ]),
        h(cardContainerStatus, [
          h(cardContainerProgressBar, {className: 'absolute flex items-center'}, [
            h(stage > 0 ? cardProgressBarObjectComplete : (stage === 0 || stage === 1) ? cardProgressBarObjectActive : cardProgressBarObjectInactive),
            h(stage > 1 ? cardProgressBarObjectComplete : stage === 2 ? cardProgressBarObjectActive : cardProgressBarObjectInactive),
            h(stage > 2 ? cardProgressBarObjectComplete : stage === 3 ? cardProgressBarObjectActive : cardProgressBarObjectInactive),
            h(stage > 3 ? cardProgressBarObjectComplete : stage === 4 ? cardProgressBarObjectActive : cardProgressBarObjectInactive)
          ]),
          h(cardTextStatus, [
            h('h6', {className: 'f5 tl mv1 ttu uppercase'}, 'Status'),
            h('h6', {className: 'status-message-here f5 tl lh-copy mv1 ttu uppercase'}, status)
          ]),
          h('div', {className: 'flex flex-row justify-between w-100 pb3 ph3'}, [
            h(cardButtonSecondary, 'Hide'),
            h(cardButtonPrimary, { to: 'assessment/' + assessment.address }, StageDisplayNames[stage])
          ])
        ])
      ])
    )
  }
}

export default AssessmentItem
