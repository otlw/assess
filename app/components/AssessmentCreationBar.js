import { Component } from 'react'
import Dropdown from "./Dropdown"
var h = require('react-hyperscript')

//this is gonna move to mainStyle object
const assessmentCreationStyle={
  frame:{
    marginTop:"1em",
    padding:"0.6em",
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
  },
  buttonStyle:{
    borderRadius:"0.8em",
    border:"1px solid black",
    padding:"0.2em 1em",
    display:"inline-block",
    marginLeft:"2em"
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

  createAssessment(e){
    this.props.loadConceptContractAndCreateAssessment(this.props.conceptList[this.state.selectedConceptKey].address)
  }

  render () {
    let conceptNameList=this.props.conceptList.map((concept)=>{
      return concept.data
    })
    return h("div",{style:assessmentCreationStyle.frame},[
      h("div",{style:assessmentCreationStyle.fieldName},"Select Concept :"),
      h("div",{style:assessmentCreationStyle.dropdown},
        h(Dropdown,{list:conceptNameList,selectedID:this.state.selectedConceptKey,set:this.setConceptKey.bind(this)})
      ),
      h("div",{style:assessmentCreationStyle.buttonStyle,onClick:this.createAssessment.bind(this)},"Create Assessment")
    ])
  }
}

export default AssessmentCreationBar
