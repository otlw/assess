import { Component } from 'react'
import AssessmentItem from '../components/AssessmentItem'
import h from 'react-hyperscript'

const assessmentListStyle={
  frame:{
    padding:"1em",
    border:"0.5px solid lightgrey"
  }
}

export class AssessmentList extends Component {
  render () {

    if (this.props.assessmentList.length === 0) {
      return h('div', {style:assessmentListStyle.frame}, 'No '+this.props.selectedTab+' Assessments')
    } else {
      return h('div', {style:assessmentListStyle.frame},this.props.assessmentList.map((assessment, k) => {
          return h(AssessmentItem, {assessment, userAddress: this.props.userAddress,selectedTab:this.props.selectedTab})
      }))
    }
  }
}

export default AssessmentList
