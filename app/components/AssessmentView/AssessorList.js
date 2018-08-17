import { Component } from 'react'
import styled from 'styled-components'
var h = require('react-hyperscript')

// component to display all assessors
class AssessorList extends Component {
  render () {
    return (
      h(containerListAssessors,
        this.props.assessors.map((assessor, k) => {
          return h('li', assessor === this.props.userAddress ? 'You' : assessor)
        }))
    )
  }
}

const containerListAssessors = styled('ul').attrs({className: 'list pl0 mt0 lh-copy gray'})``

export default AssessorList
