import h from 'react-hyperscript'
import styled from 'styled-components'

const listDescriptions = Object.freeze({
  Current: 'This is where you\'ll see the assessments you are involved in!',
  Available: 'This is where you\'ll see assessments you can help assess. ',
  Completed: 'This is where you\'ll the see assessments that you have participated in the past.'
})

export const AssessmentList = (props) => {
  if (props.assessments.length === 0) {
    return h(listContainer, [
      h(listTextTitle, props.name),
      h(listTextDescription, listDescriptions[props.name])
    ])
  } else {
    return (
      h(listContainer, [
        h(listTextTitle, props.name),
        h(listContainerCards, props.assessments.map((assessment, k) => {
          return h(props.assessmentCard, {
            assessment,
            userAddress: props.userAddress,
            networkID: props.networkID
          })
        }))
      ])
    )
  }
}

const listContainer = styled('div').attrs({className: 'flex flex-column w-100 pa2'})``

const listContainerCards = styled('div').attrs({className: 'flex flex-row flex-wrap w-100 justify-center'})``

const listTextTitle = styled('h3').attrs({className: 'f3 fw4 gray tc ttu uppercase'})``

const listTextDescription = styled('h4').attrs({className: 'f4 fw4 gray tc'})``

export default AssessmentList
