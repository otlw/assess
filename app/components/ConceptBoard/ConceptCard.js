import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'
import {Headline, Label, Body} from '../Global/Text.ts'
import {LinkPrimary} from '../Global/Links.ts'

export class ConceptCard extends Component {
  render () {
    // NOTE once the concept definition process is more defined we will want to
    // use the learnMore field that the ipfs description of a concept provides

    // set LearnMore link if it's provided by the concept data
    // let LearnMore = null
    // if (this.props.conceptData.learnMore) {
    //   LearnMore = h(cardButtonSecondary, {href: this.props.conceptData.learnMore, target: '_blank'}, 'Learn')
    // }
    return h(cardContainer, [
      h(cardContainerInfo, [
        h(cardTextObject, [
          h(Label, 'Concept'),
          h(Headline, this.props.conceptData.name)
        ])
      ]),
      h(cardContainerDescription, [
        h(Body, this.props.conceptData.description),
        h(cardContainerButtons, [
          h(LinkPrimary, {to: '/concepts/'+this.props.conceptAddress+'/create'}, 'Get Assessed')
        ])
      ])
    ])
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

// const cardButtonSecondary = styled('div').attrs({
//   className: 'flex self-end ph4 pv2 fw4 f5 items-center align-center br-pill dark-blue'
// })`box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
// `
