import { Component } from 'react'
import Dropdown from "./Dropdown"
var h = require('react-hyperscript')

const assessmentCreationStyle={
  frame:{
    marginTop:"1em",
    padding:"0.3em",
    textAlign:"left",
    border:"0.5px solid lightgrey",
    borderRadius:"0.3em"
  },
  fieldName:{
    fontWeight:"bold",
    display:"inline-block"
  },
  dropdown:{
    marginLeft:"1em",
    border:"1px solid lightblue",
    padding:"0.2em",
    display:"inline-block"
  }
}

export class AssessmentCreationBar extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedConceptKey:0
    }
  }

  setConceptKey(key){
    this.setState({selectedConceptKey:key})
  }

  render () {
    return h("div",{style:assessmentCreationStyle.frame},[
      h("div",{style:assessmentCreationStyle.fieldName},"Select Concept"),
      h("div",{style:assessmentCreationStyle.dropdown},
        h(Dropdown,{list:this.props.conceptAddressList,selectedID:this.state.selectedConceptKey,set:this.setConceptKey.bind(this)})
      )
    ])
  }
}

export default AssessmentCreationBar
