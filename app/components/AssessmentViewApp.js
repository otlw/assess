import { Component } from 'react'
var h = require('react-hyperscript')

export class AssessmentViewApp extends Component {
  render () {
  	console.log(this.props)
    return h('div',{style:{textAlign:"center"}}, [
    	h('div',"AssessmentViewApp"),
    	h('div',"insert components here"),
    	h('div',"this is how you get address from url : "+this.props.match.params.id)
 	])
  }
}

export default AssessmentViewApp
