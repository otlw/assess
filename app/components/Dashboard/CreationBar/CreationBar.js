import { Component } from 'react'
import Dropdown from './Dropdown'
import styled from 'styled-components'
import h from 'react-hyperscript'
import { TxList } from '../../TxList.js'

// styles
const CreationBox = styled('div')`
  margin-top: 1em;
  padding: 0.6em;
  text-align: left;
  border: 0.5px solid lightgrey;
`

const FieldName = styled('div')`
  font-weight: bold;
  display: inline-block
`

const DropdownBox = styled('div')`
  margin-left: 1em;
  border: 1px solid lightblue;
  padding 0.2em;
  display: inline-block;
`

const Button = styled('div')`
  border-radius: 0.8em;
  border: 1px solid black;
  padding 0.2em 1em;
  display: inline-block
  margin-left: 2em;
`

export class AssessmentCreationBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedConceptKey: 0
    }
  }

  setConceptKey (key) {
    this.setState({selectedConceptKey: key})
  }

  createAssessment (e) {
    this.props.loadConceptContractAndCreateAssessment(
      Object.keys(this.props.concepts)[this.state.selectedConceptKey]
    )
  }

  render () {
    if (this.props.loadedConcepts) {
      let conceptNames = Object.values(this.props.concepts)
      return h(CreationBox, [
        h(FieldName, 'Select Concept :'),
        h(DropdownBox, [
          h(Dropdown, {
            conceptNames: conceptNames,
            selectedID: this.state.selectedConceptKey,
            set: this.setConceptKey.bind(this)})]
        ),
        h(Button, {onClick: this.createAssessment.bind(this)}, 'Create Assessment'),
        this.props.transactions
          ? h(TxList, {transactions: this.props.transactions})
          : null
      ])
    } else {
      return h('div', 'Loading Concepts')
    }
  }
}

export default AssessmentCreationBar
