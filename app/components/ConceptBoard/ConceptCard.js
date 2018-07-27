import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

export class ConceptCard extends Component {
  render () {
    //set LearnMore link if it's provided by the concept data
    let LearnMore=h(LearnButton, 'Learn')
    if (this.props.conceptData.learnMore){
      LearnMore=h(LearnButtonLink,{href:this.props.conceptData.learnMore,target:"_blank"} ,'Learn')
    }
    return h(ConceptCardFrame, [
      h(ConceptTitleBox, [
        h(TitleCaption, 'CONCEPT'),
        h(ConceptTitle, this.props.conceptData.name)
      ]),
      h(BottomPart, [
        // TODO handle concept description
        h(ConceptDescription, "Description:\n"+this.props.conceptData.description),
        h(ButtonGroup, [
          h(GetAssessedButton, {onClick: this.props.selectConcept.bind(this), id: this.props.conceptAddress}, 'Get Assessed'),
          LearnMore
        ])
      ])
    ])
  }
}

export default ConceptCard

// styles

const ConceptCardFrame = styled('div').attrs({className: 'flex flex-column bg-white br1 shadow-3 mv3'})`
width: 300px;
height: 420px;
`
const ConceptTitleBox = styled('div').attrs({className: 'flex flex-column pv4 ph3'})`
background: #C4C4C4;
`
const TitleCaption = styled('div').attrs({className: 'flex f6'})`
color: #444444;
`
const ConceptTitle = styled('div').attrs({className: 'flex f5 pv2'})`
color: #444444;
`
const BottomPart = styled('div').attrs({className: 'flex flex-column justify-around pa3 h-100'})`
`
const ConceptDescription = styled('div').attrs({className: 'flex flex-row'})`
`
const ButtonGroup = styled('div').attrs({className: 'flex flex-row br4 ba justify-between w-80'})`
`
const GetAssessedButton = styled('div').attrs({className: 'flex h2 pa2 w5 justify-center'})`
cursor:pointer;
`
const LearnButton = styled('div').attrs({className: 'flex br4 br--right h2 pa2 w4 justify-center'})`
background: #C4C4C4;
`
const LearnButtonLink = styled('a').attrs({className: 'flex br4 br--right h2 pa2 w4 justify-center'})`
background: #C4C4C4;
text-decoration:none;
`
