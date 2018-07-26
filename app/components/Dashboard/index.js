import { Component } from 'react'
import h from 'react-hyperscript'

import FilterView from './FilterView'

export class AssessmentDashboardApp extends Component {
  render () {
    return h('div', {style: {textAlign: 'center'}}, [
      h(FilterView)
    ])
  }
}

export default AssessmentDashboardApp
