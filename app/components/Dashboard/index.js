import { Component } from 'react'
import h from 'react-hyperscript'
import CreationBar from './CreationBar'
import AssessmentFilterView from '../AssessmentFilterView'

export class AssessmentDashboardApp extends Component {
  render () {
    return h('div', {style: {textAlign: 'center'}}, [
      h(CreationBar),
      h(AssessmentFilterView)
    ])
  }
}

export default AssessmentDashboardApp
