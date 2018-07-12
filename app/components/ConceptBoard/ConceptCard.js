import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

export class ConceptCard extends Component {
  render () {
    return h(ConceptCardFrame, [
      h(ConceptTitleBox, [
        h(TitleCaption, 'CONCEPT'),
        h(ConceptTitle, this.props.conceptName)
      ]),
      h(BottomPart, [
        // TODO handle concept description
        h(ConceptDescription, 'Concept Description?'),
        h(ButtonGroup, [
          h(GetAssessedButton, {onClick: this.props.selectConcept.bind(this), id: this.props.conceptAddress}, 'Get Assessed'),
          // TODO add link from concept description JSON
          h(LearnButton, 'Learn')
        ])
      ])
    ])
  }
}

export default ConceptCard

// styles

const ConceptCardFrame = styled('div')`
background: #FFFFFF;
box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
border-radius: 2px;
margin: 1.1em 0.6em;
width:13em;
display:inline-block;
text-align:left;
`
const ConceptTitleBox = styled('div')`
background: #C4C4C4;
padding:1.9em;
`
const TitleCaption = styled('div')`
color: #444444;
font-size:0.6em;
`
const ConceptTitle = styled('div')`
color: #444444;
font-size:1.1em;
`
const BottomPart = styled('div')`
padding: 0.5em 0.25em;
`
const ConceptDescription = styled('div')`
margin-bottom:1.1em;
`
const ButtonGroup = styled('div')`
border-radius: 2px
border: 1px solid #C4C4C4;
width:12em;
`
const GetAssessedButton = styled('div')`
display:inline-block;
padding: 0.5em 0.25em;
width:6em;
text-align:center;
`
const LearnButton = styled('div')`
display:inline-block;
background: #C4C4C4;
padding: 0.5em 0.25em;
width:5em;
text-align:center;
`
