import { Component } from 'react'
import ConceptList from './ConceptList'
import styled from 'styled-components'
import h from 'react-hyperscript'
import { TxList } from '../TxList.js'

// styles

const ConceptHeaderBox = styled('div')`
background: #F2F2F2;
width:100%;
text-align:center;
`

const ConceptListBox = styled('div')`
padding:1.1em 3.5em;
background: white;
`

const HeaderTitle = styled('div')`
font-size:1.5em;
`

const Step = styled('span')`
font-size:0.7em;
border-bottom:${props => props.underlined? '2px solid #C4C4C4':null };
margin-right:1em;
`

const ConceptCreationCardFrame = styled('div')`
background: #FFFFFF;
box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
border-radius: 2px;
margin: 2.2em auto; 
width:13em;
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
const Question1 = styled('div')`
margin-bottom:1.1em;
color:#666666;
font-size:0.7em;
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


export class ConceptBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedConceptAddress: "0",
      step:1
    }
  }

  createAssessment (e) {
    this.props.loadConceptContractAndCreateAssessment(
      Object.keys(this.props.concepts)[this.state.selectedConceptKey]
    )
  }

  selectConceptAddress(e){
    this.setState({selectedConceptAddress:e.target.id})
  }

  render () {
    if (this.props.loadedConcepts) {

      let concepts=this.props.concepts

      let ConceptHeader=h('div',"Choose a Concept")
      if (this.state.selectedConceptAddress!=="0"){
        ConceptHeader=h('div',{style:{textAlign:"center"}},[
          h(HeaderTitle,"LET'S CREATE YOUR ASSESSMENT"),
          h('div',[
            h(Step,{underlined:this.state.step===1},"STEP 1"),
            h(Step,{underlined:this.state.step===2},"STEP 2"),
            h(Step,{underlined:this.state.step===3},"STEP 3")
          ]),
          h(ConceptCreationCardFrame, [
            h(ConceptTitleBox,[
              h(TitleCaption,"CONCEPT"),
              h(ConceptTitle,this.props.concepts[this.state.selectedConceptAddress])
            ]),
            h(BottomPart,[
              h(Question1,"How much do you wish to pay each assessor?"),
              h(ButtonGroup,[
                h(GetAssessedButton,{
                  //onClick:this.props.selectConcept.bind(this),
                  //id:this.props.conceptAddress
                },"Get Assessed"),
                h(LearnButton,"Learn")
              ])
            ])
          ])
        ])
      }

      return h('div', [
        h(ConceptHeaderBox, [
          ConceptHeader
        ]),
        h(ConceptListBox,[
          h(ConceptList,{concepts,selectConceptAddress:this.selectConceptAddress.bind(this)})
        ]),
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
