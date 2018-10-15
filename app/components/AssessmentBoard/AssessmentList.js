import ToggleButton from 'react-toggle-button'
import h from 'react-hyperscript'
import styled from 'styled-components'

import { Subheadline, Body } from '../Global/Text.ts'

const listDescriptions = Object.freeze({
  Current: 'This is where you\'ll see the assessments you are involved in!',
  Available: 'This is where you\'ll see assessments you can help assess. ',
  Past: 'This is where you\'ll the see assessments that you have participated in the past.'
})

const AssessmentList = (props) => {
  return (
    h(listContainer, [
      // show toggle button if it's the available list
      (props.name === 'Available'
        ? h(dashboardHeader, [
          h(listContainerText, [
            h(Subheadline, props.name)
          ]),
          h(styledToggleWrapper, [
            h(styledToggleLabel, {active: props.showHidden}, 'Show Hidden'),
            h(ToggleButton, {value: props.showHidden, onToggle: props.toggleHidden})
          ])
        ])
        : h(Subheadline, props.name)
      ),
      // show assessments or string 'None'
      (props.assessments.length === 0
        ? (Body, listDescriptions[props.name])
        : h(listContainerCards, props.assessments.map((assessment, k) => {
          return h(props.assessmentCard, {
            assessment,
            userAddress: props.userAddress,
            networkID: props.networkID
          })
        }))
      )
    ])
  )
}

export default AssessmentList

const listContainer = styled('div').attrs({className: 'flex flex-column w-100 pa2 tc'})``

const listContainerCards = styled('div').attrs({className: 'flex flex-row flex-wrap w-100 justify-center'})``

const listContainerText = styled('div').attrs({className: 'flex flex-column w-100 tc justify-center mv2'})``

const styledToggleWrapper = styled('div').attrs({className: 'flex fw4 w-100 justify-center items-center flex-wrap mv3'})`
`
const styledToggleLabel = styled('h4').attrs({className: 'fw4 mv0 mr2'})`
  color: ${props => props.active ? 'green' : '#8c8c8c'}
`
const dashboardHeader = styled('div').attrs({className: 'flex items-center w-100 flex-wrap'})`
`
