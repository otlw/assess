import { Component } from 'react'
var h = require('react-hyperscript')

export const stages = Object.freeze({
  1: 'Open',
  2: 'Commit',
  3: 'Reveal',
  4: 'Finished'
})

export class AssessmentData extends Component {
  render () {
    return (
      h('div', [
        h('div', [
          h('span', 'Assessment address:  '),
          h('span', this.props.address)
        ]),
        h('div', [
          h('span', 'Assesseee: '),
          h('span', this.props.assessee)
        ]),
        h('div', [
          h('span', 'Cost: '),
          h('span', this.props.cost)
        ]),
        h('div', [
          h('span', 'Size: '),
          h('span', this.props.size)
        ]),
        h('div', [
          h('span', 'Stage: '),
          h('span', stages[this.props.stage]),
          h('span', ' (' + this.props.stage + '/4)')
        ]),
        // display final score only if assessment is done
        this.props.stage === 4
          ? h('div', [h('span', 'final Score: '),
            (this.props.finalScore > 50
              ? h('span', { style: { 'color': '#2f2' } }, 'Pass')
              : h('span', { style: { 'color': '#f22' } }, 'Fail')),
            h('span', ' (' + this.props.finalScore + ' out of 100)')])
          : null
      ])
    )
  }
}

export default AssessmentData
