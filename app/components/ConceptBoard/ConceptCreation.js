import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

export class ConceptCreation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      amountPerAssessor: 5,
      gasEstimate: 0
    }
  }

  setAmountPerAssessor (e) {
    this.setState({amountPerAssessor: e.target.value})
  }

  cancelButton () {
    this.props.cancelCreation()
  }

  nextButton () {
    let step = this.state.step

    if (step === 1) {
      this.setState({step: step + 1})
    } else if (step === 2) {
      this.estimateGasCost()
    } else if (step === 3) {
      this.loadConceptContractAndCreateAssessment()
    }

  }

  estimateGasCost () {
    this.props.estimateGasCost(
      this.props.conceptAddress,
      this.state.amountPerAssessor,
      (cost) => {
        this.setState({gasEstimate: cost,step:3})
      }
    )
  }

  loadConceptContractAndCreateAssessment () {
    this.props.loadConceptContractAndCreateAssessment(
      this.props.conceptAddress,
      this.state.amountPerAssessor,
      (err,receipt) => {
        if (err){
          console.log(err)
          this.props.setNotificationBar({display:true,type:"error"})
        } else if (receipt.status) {
          let receiptAddress=receipt.events[0].raw.topics[2]
          let assessmentAddress="0x"+receiptAddress.substring(26,receiptAddress.length)
          this.props.setNotificationBar({display:true,type:"success",assessmentId:assessmentAddress})
        } else {
          this.setState({step:4})
        }
      }
    )
  }

  render () {
    let BottomPartContent = null

    switch (this.state.step) {
      case 1:
        BottomPartContent = h(BottomPart, [
          h(Question1, 'How much do you wish to pay each assessor?'),
          h(ButtonCaptionBox, [
            h('span', 'PAY'),
            h(RightCaption, 'TOTAL COST')
          ]),
          h(ButtonGroup, [
            h('span', [
              h(AmountPerAssessor, {
                onChange: this.setAmountPerAssessor.bind(this),
                value: this.state.amountPerAssessor,
                type: 'number',
                step: 1
              }),
              h(AHAUnit, 'AHA')
            ]),
            h(TotalAmount, this.state.amountPerAssessor * 5 + ' AHA')
          ])
        ])
        break
      case 2:
        BottomPartContent = h(BottomPart, [
          h(ParameterKey, 'ASSESSEE'),
          h(ParameterValue, 'YOU'),
          h(ParameterKey, 'NO. OF ASSESSORS'),
          h(ParameterValue, '5'),
          h(ParameterKey, 'WHAT DO YOU WANT TO PAY?'),
          h(ParameterValue, this.state.amountPerAssessor * 5 + ' AHA')
        ])
        break
      case 3:
        BottomPartContent = h(BottomPart, [
          h(Step3P, 'Ethereum charges a transaction fee to process & create your assessment. Once completed, this step is irreversible.'),
          h(ParameterKey, 'TRANSACTION COST'),
          h(CostEstimate, this.state.gasEstimate.toString().substring(0,8) + 'ETH'),
          h(Step3Bottom, "Clicking 'Next' will launch MetaMask so you can complete the transaction")
        ])
        break
      case 4:
        BottomPartContent = h(BottomPart, [
          h(Step4Title, 'Submitted & Pending'),
          h(P1, 'Your assessment has been sent to the Ethereum blockchain and is pending confirmation.'),
          h(BottomP, 'We’ll notify you once the transaction has been confirmed & your assessment is created.')
        ])
        break
    }

    // set Navigation buttons according to step
    let Navigation = (h(NavigationButtonGroup, [
      h(CancelButton, {onClick: this.cancelButton.bind(this)}, 'Cancel'),
      h(NextButton, {onClick: this.nextButton.bind(this)}, 'Next ->')
    ]))

    if ((this.state.step === 4)) {
      Navigation = (h(NavigationButtonGroup, [
        h(CloseButton, {onClick: this.cancelButton.bind(this)}, 'Close')
      ]))
    }

    // set cancelCross according to step
    let CancelCrossButton = (h('div', [
      h(CancelCrossCounterBalance, {onClick: this.cancelButton.bind(this)}, 'X'),
      h(CancelCross, {onClick: this.cancelButton.bind(this)}, 'X')
    ]))
    if (this.state.step === 4) {
      CancelCrossButton = null
    }

    return h(MainFrame, [
      CancelCrossButton,
      h(StepBox, [
        h(Step, {current: this.state.step === 1, past: this.state.step > 1}, '1'),
        h(Step, {current: this.state.step === 2, past: this.state.step > 2}, '2'),
        h(Step, {current: this.state.step === 3, past: this.state.step > 3}, '3'),
        h(Step, {current: this.state.step === 4, past: this.state.step > 4}, '4')
      ]),
      h(HeaderTitle, "LET'S CREATE YOUR ASSESSMENT"),
      h(ConceptCreationCardFrame, [
        h(ConceptTitleBox, [
          h(TitleCaption, 'CONCEPT'),
          h(ConceptTitle, this.props.conceptName)
        ]),
        BottomPartContent
      ]),
      Navigation
    ])
  }
}

export default ConceptCreation

// styles

const MainFrame = styled('div')`
text-align:center;
padding:0 0 2em 0;
`

const HeaderTitle = styled('div')`
font-size:1.5em;
margin:1em auto;
`

// steps

const StepBox = styled('div')`
padding:2em 0 0 0 ;
text-align:center;
`

const Step = styled('div')`
font-size:0.7em;
background-color:${props => props.past ? props.theme.lightgreen : props.current ? '#C4C4C4' : 'transparent'}
border:${props => props.past ? '1px solid ' + props.theme.lightgreen : '1px solid #C4C4C4'};
border-radius: 50%;
margin-right:1em;
padding-top:0.5em
width: 2em;
height: 1.5em;
display:inline-block;
`

// main card designs

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
padding: 0 1.1em;
height:15em;
`

// step 1
const Question1 = styled('div')`
margin:1.5em 0;
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
const AHAUnit = styled('div')`
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

// step 2

const ParameterKey = styled('div')`
font-size:0.6em;
margin-top:1.5em;
`
const ParameterValue = styled('div')`
`

// step 3

const Step3P = styled('div')`
margin-top:1.5em;
font-size:0.6em;
color:#666666;
line-height: 1.5em;
`
const Step3Bottom = styled('div')`
margin:4em 0 1.5em 0;
font-size:0.6em;
color:#666666;
line-height: 1.2em;
`
const CostEstimate = styled('div')`
font-size:1.5em;
color:#444444;
`
// step 4

const Step4Title = styled('div')`
margin-top:1.5em;
color:##444444;
`
const P1 = styled('div')`
margin-top:1.5em;
font-size:0.6em;
color:#666666;
line-height: 1.5em;
`
const BottomP = styled('div')`
margin-top:1.5em;
font-size:0.6em;
color:#666666;
line-height: 1.5em;
`

// navigation buttons

const NavigationButtonGroup = styled('div')`width:33em;
margin: 2.2em auto;
padding:0;
font-size:0.6em;
`
const CancelButton = styled('div')`
border-radius: 2em;
border: 1px solid #C4C4C4;
padding: 1em 1em;
display:inline-block;
width:4em;
margin-right:8.3em;
cursor:pointer;
`
const NextButton = styled('div')`
padding: 1em 1em;
display:inline-block;
width:4em;
border-radius: 2em;
border: 1px solid #C4C4C4;
background-color:#C4C4C4;
cursor:pointer;
`
const CloseButton = styled('div')`
border-radius: 2em;
border: 1px solid #C4C4C4;
background-color:#C4C4C4;
padding: 1em 1em;
display:inline-block;
width:4em;
cursor:pointer;
`
const CancelCross = styled('span')`
font-size:1.3em;
float:right;
margin:1.2em;
cursor:pointer;
`
const CancelCrossCounterBalance = styled('span')`
font-size:1.3em;
float:left;
margin:1.2em;
cursor:pointer;
color:transparent;
`
