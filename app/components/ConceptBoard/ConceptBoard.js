import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

import { Subheadline } from '../Global/Text.ts'
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

      let ConceptHeader = h(Subheadline, 'Choose a Concept')
      if (this.state.selectedConceptAddress !== '0') {
        ConceptHeader = h(AssessmentCreation, {
          setModal: this.props.setModal,
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
        // only display list when no concept is selected
        this.state.selectedConceptAddress === '0' ? h(ConceptList, {concepts, selectConceptAddress: this.selectConceptAddress.bind(this)}) : null
      ])
    } else {
      return h('div', 'Loading Concepts')
    }
  }
}

export default ConceptBoard

// styles

const ConceptHeaderBox = styled('div').attrs({className: 'w-100 tc mv4'})`
`
