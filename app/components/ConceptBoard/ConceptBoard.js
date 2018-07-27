import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

import ConceptList from './ConceptList'
import AssessmentCreation from './AssessmentCreation'

export class ConceptBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedConceptAddress: '0'
    }
  }

  selectConceptAddress (e) {
    window.scrollTo(0, 0)
    this.setState({selectedConceptAddress: e.target.id})
  }

  cancelCreation () {
    this.setState({selectedConceptAddress: '0'})
  }

  render () {
    if (this.props.loadedConcepts) {
      let concepts = this.props.concepts

      let ConceptHeader = h(ConceptHeaderDefault, 'Choose a Concept')
      if (this.state.selectedConceptAddress !== '0') {
        ConceptHeader = h(AssessmentCreation, {
          conceptData: this.props.concepts[this.state.selectedConceptAddress],
          conceptAddress: this.state.selectedConceptAddress,
          loadConceptContractAndCreateAssessment: this.props.loadConceptContractAndCreateAssessment,
          estimateGasCost: this.props.estimateAssessmentCreationGasCost,
          cancelCreation: this.cancelCreation.bind(this),
          setNotificationBar: this.props.setNotificationBar
        })
      }

      return h('div', [
        h(ConceptHeaderBox, [
          ConceptHeader
        ]),
        h(ConceptList, {concepts, selectConceptAddress: this.selectConceptAddress.bind(this)})
      ])
    } else {
      return h('div', 'Loading Concepts')
    }
  }
}

export default ConceptBoard

// styles

const ConceptHeaderBox = styled('div')`
background: #F2F2F2;
width:100%;
text-align:center;
`

const ConceptHeaderDefault = styled('div')`
`
