import { Component } from 'react'
import Dropdown from './Dropdown'
import styled from 'styled-components'
import h from 'react-hyperscript'
import { TxList } from '../TxList.js'

// styles

const ConceptHeaderBox = styled('div')`
background: #F2F2F2;
width:100%;
`
const ConceptListBox = styled('div')`
padding:2.2em 4em;
background: #E5E5E5;
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
      let conceptNames = Object.values(this.props.concepts)
      return h('div', [
        h(ConceptHeaderBox, [
          // h(Dropdown, {
          //   conceptNames: conceptNames,
          //   selectedID: this.state.selectedConceptKey,
          //   set: this.setConceptKey.bind(this)})
          h('div',"conceptheader")
        ]),
        h(ConceptListBox, 'ConceptList box'),
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
