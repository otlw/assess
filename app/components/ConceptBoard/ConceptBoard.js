import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

import ConceptList from './ConceptList'
import ConceptCreation from './ConceptCreation'
import { TxList } from '../TxList.js'

// styles

const ConceptHeaderBox = styled('div')`
background: #F2F2F2;
width:100%;
text-align:center;
`

const ConceptListBox = styled('div')`
padding:1.1em 3.5em;
background: white;
`

export class ConceptBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedConceptAddress: "0"
    }
  }

  selectConceptAddress(e){
    this.setState({selectedConceptAddress:e.target.id})
  }

  render () {
    if (this.props.loadedConcepts) {

      let concepts=this.props.concepts

      let ConceptHeader=h('div',"Choose a Concept")
      if (this.state.selectedConceptAddress!=="0"){
        ConceptHeader=h(ConceptCreation,{conceptName:this.props.concepts[this.state.selectedConceptAddress]})
      }

      return h('div', [
        h(ConceptHeaderBox, [
          ConceptHeader
        ]),
        h(ConceptListBox,[
          h(ConceptList,{concepts,selectConceptAddress:this.selectConceptAddress.bind(this)})
        ]),
        // this.props.transactions
        //   ? h(TxList, {transactions: this.props.transactions})
        //   : null
      ])
    } else {
      return h('div', 'Loading Concepts')
    }
  }
}

export default ConceptBoard
