import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'
import ConceptCard from './ConceptCard'

export class ConceptList extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    let conceptAdresses = Object.keys(this.props.concepts)
    return h('div', [
          conceptAdresses.map((conceptAdress, k) => {
            return h(ConceptCard,{conceptAddress:conceptAdress,conceptName:this.props.concepts[conceptAdress],key:k})
          })
  	])
  }
}

export default ConceptList
