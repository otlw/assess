import { Component } from 'react'
import h from 'react-hyperscript'
import AssessmentFilterViewBox from "../containers/AssessmentFilterViewBox"

export class AssessmentDashboardApp extends Component {
  render () {
    return h('div', {style: {textAlign: 'center'}}, [
    	h(AssessmentFilterViewBox)
 	])
  }
}

export default AssessmentDashboardApp
