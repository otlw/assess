import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

import { Subheadline } from '../Global/Text.ts'
import ConceptList from './ConceptList'

import { NavTabs } from '../NavTabs'

export class ConceptBoard extends Component {
  render () {
      let concepts = this.props.concepts

      let ConceptHeader = h(Subheadline, 'Choose a Concept')
      return h('div', [
        h(NavTabs),
        h(ConceptHeaderBox, [
          ConceptHeader
        ]),
        h(ConceptList, {
          concepts
        })
      ])
  }
}

export default ConceptBoard

// styles
const ConceptHeaderBox = styled('div').attrs({className: 'w-100 tc mv4'})`
`
