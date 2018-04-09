import StatusBox from '../containers/StatusBox'
import AssessmentsBox from '../containers/AssessmentsBox'
import NotificationsBox from '../containers/NotificationsBox'
import { Component } from 'react'
var h = require('react-hyperscript')

export class App extends Component {
  render () {
	return h('div', [
	    h(StatusBox),
	    h(AssessmentsBox),
	    h(NotificationsBox)
  	])
  }
}

export default App
