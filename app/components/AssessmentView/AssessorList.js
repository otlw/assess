import { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import { loadingStage } from '../../actions/utils.js'
import AssessorStatusBox from './AssessorStatus'
import { fetchAssessors } from '../../actions/assessmentActions.js'
var h = require('react-hyperscript')

// component to display all assessors
export class AssessorList extends Component {
  render () {
    if (this.props.loadedAssessors && this.props.assessors) {
      return h('div',
        this.props.assessors.map((assessor, k) => {
          return h(AssessorStatusBox, {
            assessorAddress: assessor.address,
            assessorNumber: k,
            assessorStage: parseInt(assessor.stage)
          })
        })
      )
    } else {
      return h('div', 'Loading assessors...')
    }
  }
}
const mapStateToProps = (state) => {
  return {
    loadedAssessors: (state.loading.assessmentDetail.assessors === loadingStage.Done),
    assessors: state.assessments[state.assessments.selectedAssessment].assessors
  }
}

export default compose(
  connect(mapStateToProps, {load: fetchAssessors}),
  LoadComponent
)(AssessorList)
