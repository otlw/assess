import AssessmentItem from './AssessmentItem'
import h from 'react-hyperscript'
import styled from 'styled-components'

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
    return (
      h(listContainer, [
        h('h1', props.name),
        h(listContainerCards, props.assessments.map((assessment, k) => {
          return h(AssessmentItem, {
            assessment,
            userAddress: props.userAddress,
            networkID: props.networkID
          })
        }))
      ])
    )
  }
}

const listContainer = styled('div').attrs({className: 'flex flex-column w-100'})``

const listContainerCards = styled('div').attrs({className: 'flex flex-row w-100 justify-center'})``

export default AssessmentList
