import { Component } from 'react'
import AssessmentMiniComponent from '../components/AssessmentMiniComponent'
var h = require('react-hyperscript')

export class AssessmentsColumn extends Component {
  render () {
    const columnFrameStyle = {style: {width: '29%', height: '100%', display: 'inline-block', padding: '1.5%', margin: '0.5%', border: '0.5px solid lightgrey', verticalAlign: 'top'}}
    const columnTitleStyle = {style: {fontSize: '2em', padding: '0.3em'}}

    if (this.props.assessmentList.length === 0) {
      return h('div', columnFrameStyle, [
        h('div', columnTitleStyle, this.props.columnName),
        h('div', 'No Assessments')
      ])
    } else {
      return h('div', columnFrameStyle, [
        h('div', columnTitleStyle, this.props.columnName),
        h('div', this.props.assessmentList.map((as, k) => {
          return h(AssessmentMiniComponent, {assessment: as, userAddress: this.props.userAddress})
        }))
      ])
    }
  }
}

export default AssessmentsColumn
