import { Component } from 'react'
import h from 'react-hyperscript'
import {Link} from 'react-router-dom'
import styled from 'styled-components'


export class NotificationBar extends Component {
  render () {
    return (
      h(NotificationBarFrame,{type:this.props.data.type},
        this.props.data.type==="success"?
        h('div',[
          h('span',"Success! Your assessment has been created. Click "),
          h(Link, {to: '/assessment/'+this.props.data.assessmentId},"here"),
          h('span'," to view the assessment details.")
        ])
        :h('div',[
          h("Oops! Your assessment wasn’t created due to a technical error. Click "),
          h(Link, {to: '/concepts'},"here"),
          h('span'," to try again.")
        ])
      )
    )
  }
}

export default NotificationBar

// styles
const NotificationBarFrame = styled('div')`
  text-align:center;
  padding: 0.8em 0;
  background-color: ${props => props.type==="success"? "#52CCAF" :"#FF8080"};
`