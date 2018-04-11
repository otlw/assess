import { Component } from 'react'
var h = require('react-hyperscript')

export class AssessmentDashboardApp extends Component {
  render () {
    return h('div', {style: {textAlign: 'center'}}, [
    	h('div', 'AssessmentDashboardApp'),
    	h('div', 'insert components here')
 	])
  }
}

export default AssessmentDashboardApp
