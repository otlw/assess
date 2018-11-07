import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'
import {Headline, Label, Body} from '../Global/Text.ts'
import {LinkPrimary} from '../Global/Links.ts'
import { ExplanationCard } from '../Global/cardContainers.ts'

export class ConceptCard extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showBackSide: false,
    }
  }

  showBackSide (e) {
    this.setState({showBackSide: !this.state.showBackSide})
  }

  render () {
    if (this.state.showBackSide) {
      // explanation card
      return h(ExplanationCard, {goBack: this.showBackSide.bind(this), title: this.props.conceptData.name, text: this.props.conceptData.description})
    } else {
      return h(cardContainer, [
        h(cardContainerInfo, [
          h(cardTextObject, [
            h(Label, 'Concept'),
            h(Headline, this.props.conceptData.name)
          ])
        ]),
        h(cardContainerDescription, [
          h(Body, [
            h('span',this.props.conceptData.description),
            h(moreStyle,{onClick:this.showBackSide.bind(this)},' MORE')
          ]),
          h(cardContainerButtons, [
            h(LinkPrimary, {to: '/concepts/' + this.props.conceptAddress + '/create'}, 'Get Assessed')
          ])
        ])
      ])
    }
  }
}

export default ConceptCard

// styles

const cardContainer = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4'
})`
height: 420px; 
width: 300px;
background: linear-gradient(180deg, #FFFFFF 0%, #BFD4FF 100%);
box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
`
const cardContainerInfo = styled('div').attrs({
  className: 'flex justify-between flex-column w-100 pa3'
})`
height: 50%;
`

const cardTextObject = styled('div').attrs({
  className: 'flex flex-column tl'
})`
`

const cardContainerDescription = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100 justify-between pa3'
})`
height: 50%;
`

const cardContainerButtons = styled('div').attrs({className: 'flex flex-row justify-center w-100'})`
`
const moreStyle = styled('span')`
color: ${props => props.theme.primary};
cursor:pointer;
`

