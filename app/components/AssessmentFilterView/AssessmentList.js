import { Component } from 'react'
import AssessmentItem from './AssessmentItem'
import h from 'react-hyperscript'

const assessmentListStyle = {
  frame: {
    padding: '1em',
    border: '0.5px solid lightgrey'
  }
}

const Stage = {
  None: 0,
  Called: 1,
  Confirmed: 2,
  Committed: 3,
  Done: 4,
  Burned: 5
}

export class AssessmentList extends Component {
  constructor(props){
    super(props)

    this.filters = {
      Past: (assessment) => {
        return assessment.stage === Stage.Done
      },
      Current: (assessment) => {
        // console.log(assessment)
        // console.log(this.props.userAddress)
        if(this.props.userAddress === assessment.assessee){
          return assessment.stage < Stage.Done
        }
        return assessment.stage > Stage.Called && assessment.stage < Stage.Done
      },
      Potential: (assessment) => {
        return (props.userAddress !== assessment.assessee && assessment.stage === Stage.Called)
      }
    }
  }

  render () {
    // filter assessments with the stages corresponding to the Tab
    let filteredList = this.props.assessmentList.filter(this.filters[this.props.selectedTab])

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
