import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'

import icoClose from '../../assets/ico-close.svg'

export class AssessmentCreation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      amountPerAssessor: 0,
      gasEstimate: 0
    }
  }

  setAmountPerAssessor (e) {
    // this.setState({amountPerAssessor: Math.round(e.target.value)})
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
        BottomPartContent = h(cardBodyContainer, [
          h(cardBodyColumnLeft, [
            h(cardContainerParameters, [
              h(cardLabel, 'ASSESSOR FEE'),
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
                      min: 0
                    }),
                    h(AHAUnit, 'AHA')
                  ])
                ])
              ])
            ]),
            h(cardContainerParameters, [
              h(cardLabel, 'NO. OF ASSESSORS'),
              h(cardTextObject, '5')
            ]),
            h(cardContainerParameters, [
              h(cardLabel, 'TOTAL COST'),
              h(cardTextObject, this.state.amountPerAssessor * 5 + ' AHA')
            ])
          ]),
          h(cardBodyColumnRight, [
            h(helpTextContainer, [
              h(cardTextObjectHelp, 'This fee will be paid to each of your assessors.'),
              h(cardTextObjectHelp, 'The more you pay, the more likely you will find assessors to assess you.')
            ])
          ])
        ])
        break
      case 2:
        BottomPartContent = h(cardBodyContainer, [
          h(cardBodyColumnLeft, [
            h(cardContainerParameters, [
              h(cardLabel, 'TRANSACTION COST'),
              h(cardTextObject, this.state.gasEstimate.toString().substring(0, 8) + 'ETH')
            ]),
            h(cardContainerParameters, [
              h(cardLabel, 'EQUAL TO'),
              h(cardTextObject, this.state.gasEstimate.toString().substring(0, 8) + 'USD')
            ])
          ]),
          h(cardBodyColumnRight, [
            h(helpTextContainer, [
              h(cardTextObjectHelp, 'Ethereum charges a transaction fee to process & create your assessment.'),
              h(cardTextObjectHelp, 'Click ‘Send Transaction’ to launch MetaMask and send the transaction to Ethereum.'),
              h(cardTextObjectHelp, 'Once completed, this step is irreversible.')
            ])
          ])
        ])
        break
      case 3:
        BottomPartContent = h(cardBodyContainer, [
          h(cardBodyColumnFull, [
            h(helpTextContainer, [
              h(cardTextObjectHelp, 'Click on the ‘Send’ button in MetaMask to send your assessment to Ethereum for creation.')
            ])
          ])
        ])
        break
      case 4:
        BottomPartContent = h(cardBodyColumnLeft, [
          h(cardTextTitle, 'Submitted & Pending'),
          h(cardTextObjectHelp, 'Your assessment has been sent to the Ethereum blockchain and is pending confirmation.'),
          h(cardTextObjectHelp, 'We’ll notify you once the transaction has been confirmed & your assessment is created.')
        ])
        break
    }

    // set Navigation buttons according to step
    let Navigation = (h(createAssessmentFooter, [
      h(createAssessmentButtonSecondary, {onClick: this.cancelButton.bind(this)}, [
        h('span', 'Previous')
      ]),
      h(createAssessmentButtonPrimary, {onClick: this.nextButton.bind(this)}, [
        h('span', 'Next')
      ])
    ]))

    if ((this.state.step === 4)) {
      Navigation = (h(createAssessmentFooter, [
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
      h(createAssessmentTopWrapper, [
        h(createAssessmentContainerProgressBar, [
          h(createAssessmentProgressBarObject, {current: this.state.step === 1, past: this.state.step > 1}),
          h(createAssessmentProgressBarObject, {current: this.state.step === 2, past: this.state.step > 2}),
          h(createAssessmentProgressBarObject, {current: this.state.step === 3, past: this.state.step > 3}),
          h(createAssessmentProgressBarObject, {current: this.state.step === 4, past: this.state.step > 4})
        ]),
        CancelCrossButton
      ]),
      h(createAssessmentWrapper, [
        h(createAssessmentCardContainer, [
          h(createAssessmentHeader, [
            h(cardLabelTitle, 'Concept'),
            h(cardTextTitle, this.props.conceptName),
            h(createAssessmentTextDesc, "Let's create your assessment")
          ]),
          BottomPartContent
        ]),
        Navigation
      ])
    ])
  }
}

export default AssessmentCreation

// styles

const createAssessmentContainer = styled('div').attrs({ className: 'flex flex-column items-center w-100 h-100 bg-white pa2 tc' })`
`

const createAssessmentTextDesc = styled('h4').attrs({className: 'f4 fw4 tl mt4'})`
color: ${props => props.theme.primary};
`

// steps

const createAssessmentTopWrapper = styled('div').attrs({className: 'flex flex-row w-100 items-center justify-center'})`
`

const createAssessmentContainerProgressBar = styled('div').attrs({className: 'flex flex-row self-center content-center justify-around w-100 mw4'})`
`

const createAssessmentProgressBarObject = styled('div').attrs({className: 'flex items-center justify-center br-100 ba'})`
width: 10px;
height: 10px;
background-color:${props => props.past ? props.theme.primary : props.current ? '#322EE5' : 'transparent'}
border:${props => props.past ? '1px solid ' + props.theme.primary : '1px solid #322EE5'};
`

// main card designs

const createAssessmentWrapper = styled('div').attrs({className: 'flex flex-column w-100 h-100'})`
max-width: 800px;`

const createAssessmentCardContainer = styled('div').attrs({className: 'flex flex-column w-100 self-center mt3 br2 shadow-4'
})`
max-width: 800px;
background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #f5fcff 85.98%);
`

const createAssessmentHeader = styled('div').attrs({className: 'flex content-start flex-column w-100 pa4'})`
background-color: #D7E0FA;
`
const cardLabelTitle = styled('h5').attrs({className: 'f5 fw4 tl ttu uppercase mv0'})`
color: ${props => props.theme.primary};
`
const cardTextTitle = styled('h3').attrs({className: 'f2 fw4 mt2 mb0 w-100 tl'})`
color: ${props => props.theme.primary};
`

const cardBodyContainer = styled('div').attrs({className: 'flex flex-row w-100 h-100 pa4'})`
min-height:360px;
background-color: #F5F5FF;

`

const cardBodyColumnLeft = styled('div').attrs({className: 'flex flex-column w-50 h-100 justify-between'})`
`

const cardBodyColumnRight = styled('div').attrs({className: 'flex flex-column w-50 h-100 justify-between'})`
`

const cardBodyColumnFull = styled('div').attrs({className: 'flex flex-column w-100 h-100 justify-start'})`
`

const ButtonCaptionContainer = styled('div').attrs({className: 'flex flex-column w-50 align-center justify-between'})`
`

const InputContainer = styled('div').attrs({className: 'flex flex-row justify-between items-center pv2'})`
`

const ButtonCaptionBox = styled('div').attrs({className: 'flex justify-between f6'})`
`

const ButtonGroup = styled('div').attrs({className: 'flex flex-row justify-between br1 ph3 f4'})`
background-color: #d6dffa;
`
const AmountPerAssessor = styled('input').attrs({className: 'flex w-25 tl pa1 bn bg-transparent '})`
`
const AHAUnit = styled('div').attrs({className: 'mid-gray'})`
`
const helpTextContainer = styled('div').attrs({className: 'flex flex-column h-100 justify-end'})`
`

const cardTextObjectHelp = styled('h5').attrs({className: 'flex f5 fw4 lh-copy tl mv2'})`
color:#0A4A66;
`

// step 2

const cardContainerParameters = styled('div').attrs({className: 'flex w-100 flex-column items-start fw4 mv3'})`
`

const cardLabel = styled('h6').attrs({className: 'f5 fw4 tl mv1'})`
color: ${props => props.theme.primary};
`
const cardTextObject = styled('h4').attrs({className: 'f4 fw4 tl mv1'})`
color: ${props => props.theme.secondary};
`

// step 4

// Custom styles no longer necessary for Step 4

// navigation buttons

const createAssessmentFooter = styled('div').attrs({className: 'flex flex-row w-100 items-center justify-between pa3 shadow-4'})`
margin-top: 1px;
background-color: #F5F5FF;
`
const createAssessmentButtonSecondary = styled('div').attrs({className: 'flex items-center justify-center ph4 pv2 br-pill shadow-2'})`
cursor:pointer;
color: #322EE5;
background-color: #fff;
`
const createAssessmentButtonPrimary = styled('div').attrs({className: 'flex flex-row items-center justify-center ph4 pv2 br-pill ttu uppercase shadow-2'})`
cursor:pointer;
color: #F1F2FB;
background-color: #322EE5;
`
const CloseButton = styled('div').attrs({className: 'flex self-center items-center justify-center w4 h2 br4 ba'})`
border-color: #C4C4C4;
background-color:#C4C4C4;
cursor:pointer;
`
const CancelCrossContainer = styled('div').attrs({className: 'flex justify-end w-auto h2'})`
`
const CancelCross = styled('img').attrs({className: 'ma2 f4'})`
cursor:pointer;
`
