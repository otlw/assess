import { Component } from 'react'
var h = require('react-hyperscript')

export class AssessmentViewApp extends Component {
  render () {
    return h('div',{style:{textAlign:"center"}}, [
    	h('div',"AssessmentViewApp"),
    	h('div',"insert components here")
 	])
  }
}

export default AssessmentViewApp
