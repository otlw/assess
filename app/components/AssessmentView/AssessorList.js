import { Component } from 'react'
var h = require('react-hyperscript')

// component to display all assessors
class AssessorList extends Component {
  render () {
    return (
      h('ul',
        this.props.assessors.map((assessor, k) => {
          return h('li', assessor)
        }))
    )
  }
}

export default AssessorList
