import { Component } from 'react'
import ConceptList from './ConceptList'
import styled from 'styled-components'
import h from 'react-hyperscript'
import { TxList } from '../TxList.js'

// styles

const MainFrame = styled('div')`
text-align:center;
padding:3em 0;
`

const HeaderTitle = styled('div')`
font-size:1.5em;
`

const StepBox = styled('div')`
margin:2.2em 0 ;
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
margin: 0 auto; 
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
padding: 1.3em 1.1em;
`
const Question1 = styled('div')`
margin-bottom:1.5em;
color:#666666;
font-size:0.7em;
`
const ButtonCaptionBox = styled('div')`
font-size: 0.6em;
width:100%;
`
const RightCaption = styled('span')`
float: right;
`

const ButtonGroup = styled('div')`
border-radius: 2px
border: 1px solid #C4C4C4;
width:100%;
padding:0;
margin-bottom:6.5em;
`
const AmountPerAssessor = styled('input')`
display:inline-block;
padding: 0.5em 0.5em;
width:2.5em;
text-align:left;
border:none;
text-decoration:none;
font-size:1em;
`
const AHAUnit =styled('div')`
padding: 0.5em 0.5em 0.5em 0;
display:inline-block;
`

const TotalAmount = styled('div')`
display:inline-block;
background: #F2F2F2;
padding: 0.5em 0.25em;
width:4em;
text-align:center;
`

const NavigationButtonGroup = styled('div')`
border-radius: 2px
border: 1px solid #C4C4C4;
width:33em;
margin: 2.2em auto;
padding:0;
font-size:0.6em;
`
const BackButton =styled('div')`
background-color:#C4C4C4;
padding: 1em 3.5em;
display:inline-block;
width:4em;
`
const CancelButton =styled('div')`
padding: 1em 3.5em;
display:inline-block;
width:4em;
`
const NextButton =styled('div')`
background-color:#C4C4C4;
padding: 1em 3.5em;
display:inline-block;
width:4em;
`


export class ConceptCreation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step:1,
      amountPerAssessor:5
    }
  }

  createAssessment (e) {
    this.props.loadConceptContractAndCreateAssessment(
      Object.keys(this.props.concepts)[this.state.selectedConceptKey]
    )
  }

  setAmountPerAssessor(e){
    this.setState({amountPerAssessor:e.target.value})
  }

  backButton(e){
    console.log("back")
  }

  cancelButton(e){
    console.log("cancel")
  }

  nextButton(e){
    console.log("next")
  }

  render () {
    return h(MainFrame,[
          h(HeaderTitle,"LET'S CREATE YOUR ASSESSMENT"),
          h(StepBox,[
            h(Step,{underlined:this.state.step===1},"STEP 1"),
            h(Step,{underlined:this.state.step===2},"STEP 2"),
            h(Step,{underlined:this.state.step===3},"STEP 3")
          ]),
          h(ConceptCreationCardFrame, [
            h(ConceptTitleBox,[
              h(TitleCaption,"CONCEPT"),
              h(ConceptTitle,this.props.conceptName)
            ]),
            h(BottomPart,[
              h(Question1,"How much do you wish to pay each assessor?"),
              h(ButtonCaptionBox,[
                h('span','PAY'),
                h(RightCaption,'TOTAL COST')
              ]),
              h(ButtonGroup,[
                h('span',[
                  h(AmountPerAssessor,{
                    onChange:this.setAmountPerAssessor.bind(this),
                    value:this.state.amountPerAssessor,
                    type:"number",
                    step:1
                  }),
                  h(AHAUnit,"AHA"),
                ]),
                h(TotalAmount,this.state.amountPerAssessor*5+" AHA")
              ])
            ])
          ]),
          h(NavigationButtonGroup,[
            h(BackButton,{onClick:this.backButton.bind(this)},"<- Back"),
            h(CancelButton,{onClick:this.cancelButton.bind(this)},"Cancel"),
            h(NextButton,{onClick:this.nextButton.bind(this)},"Next ->")
          ])
        ])
  }
}

export default ConceptCreation
