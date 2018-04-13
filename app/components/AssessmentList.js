import { Component } from 'react'
import AssessmentItem from '../components/AssessmentItem'
import h from 'react-hyperscript'

const assessmentListStyle = {
  frame: {
    padding: '1em',
    border: '0.5px solid lightgrey'
  }
}

const stagesOfTab = {
  'Past': [3, 6, 7],
  'Current': [0, 2, 4, 5],
  'Potential': [1]
}

export class AssessmentList extends Component {
  render () {
    // filter assessments with the stages corresponding to the Tab
    let filteredList = this.props.assessmentList.filter((assessment) => {
      return stagesOfTab[this.props.selectedTab].indexOf(assessment.stage) > -1
    })

    // map assessment list to components
    if (filteredList.length === 0) {
      return h('div', {style: assessmentListStyle.frame}, 'No ' + this.props.selectedTab + ' Assessments')
    } else {
      return h('div', {style: assessmentListStyle.frame}, filteredList.map((assessment, k) => {
        return h(AssessmentItem, {assessment, userAddress: this.props.userAddress, selectedTab: this.props.selectedTab})
      }))
    }
  }
}

export default AssessmentList
