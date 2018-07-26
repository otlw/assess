import AssessmentItem from './AssessmentItem'
import h from 'react-hyperscript'

const assessmentListStyle = {
  frame: {
    padding: '1em',
    border: '0.5px solid lightgrey'
  }
}

export const AssessmentList = (props) => {
  if (props.assessments.length === 0) {
    return h('div', {style: assessmentListStyle.frame}, [
      h('h1', props.name),
      'None'
    ])
  } else {
    return h(
      'div', {style: assessmentListStyle.frame},
      [h('h1', props.name)].concat(
        props.assessments.map((assessment, k) => {
          return h(AssessmentItem, {
            assessment,
            userAddress: props.userAddress,
            networkID: props.networkID
          })
        })))
  }
}

export default AssessmentList
