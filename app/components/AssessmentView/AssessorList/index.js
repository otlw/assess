import h from 'react-hyperscript'
import AssessorStatusBox from '../AssessorStatus'

export const AssessorList = (props) => {
  let assessorLines = []
  let k = 0
  if (props.assessorStages) {
    for (let assessor of Object.keys(props.assessorStages)) {
      assessorLines.push(
        h(AssessorStatusBox, {
          assessorAddress: assessor,
          assessorNumber: k,
          assessmentAddress: props.address,
          stage: props.stage,
          assessorStage: props.assessorStages[assessor],
          payout: props.payouts ? this.props.payouts[assessor] : ''
        })
      )
      k++
    }
  }
  return h('div', assessorLines)
}

export default AssessorList
