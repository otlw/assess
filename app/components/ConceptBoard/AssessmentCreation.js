import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

import icoArrowForward from '../../assets/ico-arrow-forward.svg'
import icoClose from '../../assets/ico-close.svg'
import icoConfirm from '../../assets/ico-confirm.svg'
// import iconArrowBack from '../../assets/icon-arrow-back.svg'

export class AssessmentCreation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      amountPerAssessor: 5, // TODO set defualt value to 0 once bug is resolved (#277)
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
      this.setState({step: 2})
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
        this.setState({gasEstimate: cost, step: 3})
      }
    )
  }

  loadConceptContractAndCreateAssessment () {
    this.props.loadConceptContractAndCreateAssessment(
      this.props.conceptAddress,
      this.state.amountPerAssessor,
      (err, receipt) => {
        if (err) {
          console.log(err)
          this.props.setNotificationBar({display: true, type: 'error'})
          this.props.cancelCreation()
        } else if (receipt.status) {
          let receiptAddress = receipt.events[0].raw.topics[2]
          let assessmentAddress = '0x' + receiptAddress.substring(26, receiptAddress.length)
          this.props.setNotificationBar({display: true, type: 'success', assessmentId: assessmentAddress})
          this.props.cancelCreation()
        } else {
          this.setState({step: 4})
        }
      }
    )
  }

  render () {
    let BottomPartContent = null

    switch (this.state.step) {
      case 1:
        BottomPartContent = h(cardContainerInput, [
          h(Question1, 'Your Assessment Fee'),
          h(ButtonCaptionContainer, [
            h(ButtonCaptionBox
            ),
            h(ButtonGroup, [
              h(InputContainer, [
                h(AmountPerAssessor, {
                  onChange: this.setAmountPerAssessor.bind(this),
                  value: this.state.amountPerAssessor,
                  type: 'number',
                  step: 1,
                  min: 1
                }),
                h(AHAUnit, 'AHA')
              ])
            ])
          ]),
          h(helpTextContainer, [
            h(cardTextObjectHelp, 'This fee will be paid to each of your assessors.'),
            h(cardTextObjectHelp, 'The more you pay, the more likely you will find assessors to assess you.')
          ])
        ])
        break
      case 2:
        BottomPartContent = h(cardContainerInput, [
          h(cardContainerParameters, [
            h(cardLabel, 'ASSESSEE'),
            h(cardTextObject, 'YOU')
          ]),
          h(cardContainerParameters, [
            h(cardLabel, 'NO. OF ASSESSORS'),
            h(cardTextObject, '5')
          ]),
          h(cardContainerParameters, [
            h(cardLabel, 'TOTAL COST'),
            h(cardTextObject, this.state.amountPerAssessor * 5 + ' AHA')
          ])
        ])
        break
      case 3:
        BottomPartContent = h(cardContainerInput, [
          h(Step3P, 'Ethereum charges a transaction fee to process & create your assessment. Once completed, this step is irreversible.'),
          h(EstimateBox, [
            h(TransactionCostTitle, 'TRANSACTION COST'),
            h(CostEstimate, this.state.gasEstimate.toString().substring(0, 8) + 'ETH')
          ]),
          h(Step3Bottom, "Clicking 'Next' will launch MetaMask so you can complete the transaction")
        ])
        break
      case 4:
        BottomPartContent = h(cardContainerInput, [
          h(Step4Title, 'Submitted & Pending'),
          h(P1, 'Your assessment has been sent to the Ethereum blockchain and is pending confirmation.'),
          h(BottomP, 'We’ll notify you once the transaction has been confirmed & your assessment is created.')
        ])
        break
    }

    // set Navigation buttons according to step
    let Navigation = (h(createAssessmentContainerNavigate, [
      h(createAssessmentButtonCancel, {onClick: this.cancelButton.bind(this)}, [
        h('img', {alt: 'icoClose', src: icoClose, className: 'h1 ma1'}),
        h('span', 'Cancel')
      ]),
      h(createAssessmentButtonNext, {onClick: this.nextButton.bind(this)}, [
        h('span', 'Next'),
        h('img', {alt: 'icoArrowForward', src: icoArrowForward})
      ])
    ]))

    if ((this.state.step === 4)) {
      Navigation = (h(createAssessmentContainerNavigate, [
        h(CloseButton, {onClick: this.cancelButton.bind(this)}, [
          h('img', {alt: 'icoClose', src: icoClose, className: 'h1 ma1'}),
          h('span', 'Close')
        ])
      ]))
    }
    // h(Logo, {alt: 'logo', src: fathomLogo})

    // set cancelCross according to step
    let CancelCrossButton = (h(CancelCrossContainer, [
      h(CancelCross, {onClick: this.cancelButton.bind(this), alt: 'icoClose', src: icoClose})
    ]))
    if (this.state.step === 4) {
      CancelCrossButton = h(CancelCrossContainer, '')
    }

    return h(createAssessmentContainer, [
      CancelCrossButton,
      h(createAssessmentContainerProgressBar, [
        h(createAssessmentProgressBarObject, {current: this.state.step === 1, past: this.state.step > 1}, '1'),
        h(createAssessmentProgressBarObject, {current: this.state.step === 2, past: this.state.step > 2}, '2'),
        h(createAssessmentProgressBarObject, {current: this.state.step === 3, past: this.state.step > 3}, '3'),
        h(createAssessmentProgressBarObjectFinal, {current: this.state.step === 4, past: this.state.step > 4, alt: 'icoConfirm', src: icoConfirm})
      ]),
      h(createAssessmentTitle, "Let's create your assessment"),
      h(createAssessmentCardContainer, [
        h(createAssessmentCardContainerConcept, [
          h(cardLabelTitle, 'Concept'),
          h(cardTitleConcept, this.props.conceptName)
        ]),
        BottomPartContent
      ]),
      Navigation
    ])
  }
}

export default AssessmentCreation

// styles

const createAssessmentContainer = styled('div').attrs({ className: 'flex flex-column w-100 h-100 bg-near-white pa2 tc' })`

`

const createAssessmentTitle = styled('h3').attrs({className: 'f3 fw4 tc ttu uppercase '})`
`

// steps

const createAssessmentContainerProgressBar = styled('div').attrs({className: 'flex flex-row self-center justify-around w-100 mw5'})`
`

const createAssessmentProgressBarObject = styled('div').attrs({className: 'flex items-center justify-center w2 h2 br-100 ba'})`
background-color:${props => props.past ? props.theme.lightgreen : props.current ? '#C4C4C4' : 'transparent'}
border:${props => props.past ? '1px solid ' + props.theme.lightgreen : '1px solid #C4C4C4'};
`
const createAssessmentProgressBarObjectFinal = styled('img').attrs({className: 'flex items-center justify-center w2 h2 br-100 ba'})`
background-color:${props => props.past ? props.theme.lightgreen : props.current ? '#C4C4C4' : 'transparent'}
border:${props => props.past ? '1px solid ' + props.theme.lightgreen : '1px solid #C4C4C4'};
`

// main card designs

const createAssessmentCardContainer = styled('div').attrs({className: 'flex flex-column self-center ma3 br2 shadow-4'
})`height: 420px; width: 300px;background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #f5fcff 85.98%);
`

const createAssessmentCardContainerConcept = styled('div').attrs({className: 'flex content-start flex-column w-100 h-50 pa3 bg-none'})`
`
const cardLabelTitle = styled('div').attrs({className: 'flex flex-column tl ttu uppercase'})`
color: #0A4A66;
`
const cardTitleConcept = styled('h3').attrs({className: 'f3 fw4 mv1 w-100 tl'})`
color: #117099;
`

const cardContainerInput = styled('div').attrs({className: 'flex flex-column h-100 pa3 justify-between bg-lightest-blue'})`
`

// step 1
const Question1 = styled('div').attrs({className: 'f5 lh-copy dark-gray tl ttu uppercase'})`
`

const ButtonCaptionContainer = styled('div').attrs({className: 'flex flex-column w-70 align-center justify-between'})`
`

const InputContainer = styled('div').attrs({className: 'flex flex-row justify-between items-center pv2'})`
`

const ButtonCaptionBox = styled('div').attrs({className: 'flex justify-between f6'})`
`

const ButtonGroup = styled('div').attrs({className: 'flex flex-row justify-between br1 ba b--mid-gray pv1 ph3 f4'})`
`
const AmountPerAssessor = styled('input').attrs({className: 'flex w-25 tl pa1 bn bg-transparent '})`
`
const AHAUnit = styled('div').attrs({className: 'mid-gray'})`
`
const helpTextContainer = styled('div').attrs({className: 'flex flex-column h-100 justify-end'})`
`

const cardTextObjectHelp = styled('h6').attrs({className: 'flex f6 fw4 dark-gray lh-copy tl mv2'})`
`

// step 2

const cardContainerParameters = styled('div').attrs({className: 'flex w-100 flex-column items-start fw4'})`
`

const cardLabel = styled('h6').attrs({className: 'f5 fw4 tl mv1'})`
color: #0A4A66;
`
const cardTextObject = styled('h4').attrs({className: 'f4 fw4 tl mv1'})`
color: #117099;
`

// step 3

const Step3P = styled('div').attrs({className: 'flex flex-row f6 lh-copy'})`
color:#666666;
`
const EstimateBox = styled('div').attrs({className: 'flex flex-column self-center'})`
`
const TransactionCostTitle = styled('div').attrs({className: 'flex flex-row f6 mt3 self-center'})`
color:#666666;
`
const CostEstimate = styled('div').attrs({className: 'flex flex-row f5 fw3 self-center'})`
color:#444444;
`
const Step3Bottom = styled('div').attrs({className: 'flex flex-row f6 lh-copy mt3'})`
color:#666666;
`

// step 4

const Step4Title = styled('div').attrs({className: 'flex flex-row f5 fw2 self-center'})`
color:##444444;
`
const P1 = styled('div').attrs({className: 'flex flex-row f6 fw2 lh-copy mt3'})`
color:#666666;
`
const BottomP = styled('div').attrs({className: 'flex flex-row f6 fw2 lh-copy mt3'})`
color:#666666;
`
// navigation buttons

const createAssessmentContainerNavigate = styled('div').attrs({className: 'flex w-100 mw7 flex-row items-center self-center justify-around h3'})`
`
const createAssessmentButtonCancel = styled('div').attrs({className: 'flex items-center justify-center w4 h2 br4 ba bg-transparent'})`
cursor:pointer;
`
const createAssessmentButtonNext = styled('div').attrs({className: 'flex flex-row items-center justify-center w4 h2 br4 ba bg-light-green dark-gray'})`
cursor:pointer;
`
const CloseButton = styled('div').attrs({className: 'flex self-center items-center justify-center w4 h2 br4 ba'})`
border-color: #C4C4C4;
background-color:#C4C4C4;
cursor:pointer;
`
const CancelCrossContainer = styled('div').attrs({className: 'flex justify-end w-100 h2'})`
`
const CancelCross = styled('img').attrs({className: 'ma2 f4'})`
cursor:pointer;
`
