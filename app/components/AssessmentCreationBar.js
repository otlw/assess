import { Component } from 'react'
import Dropdown from "./Dropdown"
import styled from "styled-components"
var h = require('react-hyperscript')

//this is gonna move to mainStyle object
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
    this.props.loadConceptContractAndCreateAssessment(this.props.conceptList[this.state.selectedConceptKey].address)
  }

  render () {
    let conceptNameList = this.props.conceptList.map((concept) => {
      return concept.data
    })
    return h(CreationBox,[
      h(FieldName, "Select Concept :"),
      h(DropdownBox,[
        h(Dropdown, {
          list: conceptNameList,
          selectedID: this.state.selectedConceptKey,
          set: this.setConceptKey.bind(this)})]
      ),
      h(Button, {onClick: this.createAssessment.bind(this)},"Create Assessment")
    ])
  }
}

export default AssessmentCreationBar
