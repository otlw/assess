import { Component } from 'react'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {
  render () {
    if (this.props.loadedAssessors) {
      return h('ul',
        this.props.assessors.map((assessor, k) => {
          return h('li', assessor.address)
        }))
    } else {
      return h('div', 'Loading assessors...')
    }
  }
}

export default AssessorList
