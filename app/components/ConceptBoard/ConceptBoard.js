import { Component } from 'react'
import ConceptList from './ConceptList'
import styled from 'styled-components'
import h from 'react-hyperscript'
import { TxList } from '../TxList.js'

// styles

const ConceptHeaderBox = styled('div')`
background: #F2F2F2;
width:100%;
`
const ConceptListBox = styled('div')`
padding:1.1em 3.5em;
background: white;
`

export class ConceptBoard extends Component {
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
      //let conceptNames = Object.values(this.props.concepts)
      console.log(this.props.concepts)
      let concepts=this.props.concepts
      return h('div', [
        h(ConceptHeaderBox, [
          // h(Dropdown, {
          //   conceptNames: conceptNames,
          //   selectedID: this.state.selectedConceptKey,
          //   set: this.setConceptKey.bind(this)})
          h('div',"conceptheader")
        ]),
        h(ConceptListBox,[h(ConceptList,{concepts})]),
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
