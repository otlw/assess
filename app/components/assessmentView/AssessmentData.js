import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AssessorList from './AssessorList'
var h = require('react-hyperscript')

export class AssessmentData extends Component {

  render() {
    return (
      h('div', [
        h('div',[
          h('span', "Assessment address:  "),
          h('span', this.props.address)
        ]),
        /* h('div',[
         *   h('span', 'Assesseee: '),
         *   h('span', this.props.assessment.assessee),
         * ]),
         * h('div',[
         *   h('span', 'cost: '),
         *   h('span', this.props.assessment.cost),
         * ]),
         * h('div',[
         *   h('span', 'size: '),
         *   h('span', this.props.assessment.size)
         * ]),
         * h('div',[
         *   h('span', 'stage: '),
         *   h('span', this.props.assessment.stage),
         *   h('span', ' (out of 4)')
         * ]), */
      ])
    )
  }
}

AssessmentData.propTypes = {
  /* assessment:  React.PropTypes.object.isRequired */
}

export default AssessmentData
