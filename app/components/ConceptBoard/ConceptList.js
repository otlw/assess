import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'
import ConceptCard from './ConceptCard'

export class ConceptList extends Component {
  render () {
    let conceptAdresses = Object.keys(this.props.concepts)
    return h(ConceptListBox, [
      conceptAdresses.map((conceptAdress, k) => {
        return h(ConceptCard, {
          conceptAddress: conceptAdress,
          conceptData: this.props.concepts[conceptAdress],
          key: k
        })
      })
    ])
  }
}

export default ConceptList

const ConceptListBox = styled('div').attrs({className: 'flex flex-row flex-wrap bg-white justify-center content-around'})`
`
