import { Component } from 'react'
import h from 'react-hyperscript'

import AssessmentFilterViewBox from '../containers/AssessmentFilterViewBox'
import AssessmentCreationBox from '../containers/AssessmentCreationBox'

export class AssessmentDashboardApp extends Component {
  render () {
    return h('div', {style: {textAlign: 'center'}}, [
      h(AssessmentCreationBox),
      h(AssessmentFilterViewBox)
 	])
  }
}

export default AssessmentDashboardApp
