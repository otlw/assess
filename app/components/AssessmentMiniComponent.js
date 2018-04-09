import { Component } from 'react'
var h = require('react-hyperscript')

export class AssessmentMiniComponent extends Component {
  render () {
    const assessment = this.props.assessment
    const userAddress = this.props.userAddress

    // styles
    const frameStyle = {style: {'borderTop': '0.5px solid lightgrey', margin: '0.5em 0'}}
    const titleStyle = {style: {'fontSize': '24px', 'fontStyle': 'bold'}}
    const fieldStyle = {style: {'fontSize': '14px', 'fontStyle': 'bold'}}
    const valueStyle = {style: {'fontSize': '11px'}}

    const assesseeStyle = {style: {width: '6em', textAlign: 'center', borderRadius: '0.8em', color: 'white', backgroundColor: 'purple', padding: '0.2em 0.3em'}}
    const assessorStyle = {style: {width: '6em', textAlign: 'center', borderRadius: '0.8em', color: 'white', backgroundColor: 'blue', padding: '0.2em 0.3em'}}
    const potAssessorStyle = {style: {width: '12em', textAlign: 'center', borderRadius: '0.8em', color: 'white', backgroundColor: 'lightblue', padding: '0.2em 0.3em'}}

    let role = null
    if (userAddress === assessment.assessee) {
      role = h('div', assesseeStyle, 'Assessee')
    } else if (assessment.assessors && assessment.assessors.indexOf(userAddress) > -1) {
      role = h('div', assessorStyle, 'Assessor')
    } else if (assessment.potAssessors && assessment.potAssessors.indexOf(userAddress) > -1) {
      role = h('div', potAssessorStyle, 'Potential Assessor')
    }
    return h('div', frameStyle, [
      h('br'),
      h('div', titleStyle, 'Assessment'),
      h('div', valueStyle, assessment.address),
      h('br'),
      role,
      h('span', fieldStyle, 'cost : '),
      h('span', valueStyle, assessment.cost),
      h('br'),
      h('span', fieldStyle, 'size : '),
      h('span', valueStyle, assessment.size),
      h('br'),
      h('span', fieldStyle, 'Assessment Assessee : '),
      h('span', valueStyle, assessment.assessee),
      h('br'),
      h('span', fieldStyle, 'stage : '),
      h('span', valueStyle, assessment.stage),
      h('br'),
      h('span', fieldStyle, 'conceptData : '),
      h('span', valueStyle, assessment.conceptData),
      h('br')
    ])
  }
}

export default AssessmentMiniComponent
