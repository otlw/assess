import { Component } from 'react'
import AssessmentCreationBox from "../containers/AssessmentCreationBox"
var h = require('react-hyperscript')

export class AssessmentDashboardApp extends Component {

  render () {
    return h('div',{style:{textAlign:"center"}}, [
    	h(AssessmentCreationBox)
 	])
  }
}

export default AssessmentDashboardApp
