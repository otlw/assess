import { Component } from 'react'
import h from 'react-hyperscript'

import FilterView from './FilterView'
import CreationBar from './CreationBar'

export class AssessmentDashboardApp extends Component {
  render () {
    return h('div', {style: {textAlign: 'center'}}, [
      // h(CreationBar),
      h(FilterView)
    ])
  }
}

export default AssessmentDashboardApp
