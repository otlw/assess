import { Component } from 'react'
import h from 'react-hyperscript'
import ConceptCard from './ConceptCard'

export class ConceptList extends Component {
  render () {
    let conceptAdresses = Object.keys(this.props.concepts)
    return h('div', {style: {textAlign: 'center'}}, [
      conceptAdresses.map((conceptAdress, k) => {
        return h(ConceptCard, {
          conceptAddress: conceptAdress,
          conceptName: this.props.concepts[conceptAdress],
          key: k,
          selectConcept: this.props.selectConceptAddress.bind(this)
        })
      })
    ])
  }
}

export default ConceptList
