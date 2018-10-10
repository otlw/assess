import { Component } from 'react'
import styled from 'styled-components'
var h = require('react-hyperscript')

// component to display all assessors
class AssessorList extends Component {
  render () {
    return (
      h(containerListAssessors,
        this.props.assessors.map((assessor, k) => {
          return h(containerListItem, assessor === this.props.userAddress ? 'You' : assessor)
        }))
    )
  }
}

const containerListAssessors = styled('ul').attrs({className: 'list self-start pl0 mt0 lh-copy'})`
`

const containerListItem = styled('li').attrs({className: 'w5 ellipsis truncate'})`
color: ${props => props.theme.textBody}
`

export default AssessorList
