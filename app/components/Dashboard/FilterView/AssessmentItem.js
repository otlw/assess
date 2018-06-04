import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import { stages } from '../../../constants.js'

// styles
const itemStyle = {
  frameStyle: {
    display: 'inline-block',
    border: '0.5px solid lightgrey',
    margin: '0.3em',
    padding: '0.3em'
  },
  titleStyle: {
    'fontSize': '24px',
    'fontStyle': 'bold'
  }
}

export class AssessmentItem extends Component {
  render () {
    const assessment = this.props.assessment
    return (
      h('div', {style: itemStyle.frameStyle}, [
        h('br'),
        h('div', itemStyle.titleStyle, 'in: ' + assessment.conceptData),
        h(Link,
          {to: 'assessment/' + assessment.address},
          'at: ' + assessment.address.substring(0, 5) + '...' + assessment.address.substring(37)),
        h('div', [
          h('span', itemStyle.titleStyle, 'Stage: '),
          h('span', stages[assessment.stage])
        ]),
        h('div', [
          h('span', itemStyle.titleStyle, 'Role: '),
          h('span', assessment.assessee === this.props.userAddress ? 'Assessee' : 'Assessor')
        ]),
        h('br')
      ])
    )
  }
}

export default AssessmentItem
