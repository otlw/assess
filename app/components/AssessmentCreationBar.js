import { Component } from 'react'
import Dropdown from "./Dropdown"
var h = require('react-hyperscript')

export class ConceptList extends Component {
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
    return h(Dropdown,{list:this.props.conceptAddressList,selectedID:this.state.selectedConceptKey,set:this.setConceptKey.bind(this)})
  }
}

export default ConceptList
