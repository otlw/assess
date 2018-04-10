import ConceptBox from '../containers/ConceptBox'
import { Component } from 'react'
var h = require('react-hyperscript')

export class AssessmentDashboardApp extends Component {
  render () {
    return h('div', [
    	h(ConceptBox)
 	])
  }
}

export default AssessmentDashboardApp
