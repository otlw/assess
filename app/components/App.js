import StatusBox from '../containers/StatusBox'
import ConceptBox from '../containers/ConceptBox'
import { Component } from 'react'
var h = require('react-hyperscript')

export class App extends Component {
  render () {
	return h('div', [
	    h(StatusBox),
	    h(ConceptBox)
  	])
  }
}

export default App
