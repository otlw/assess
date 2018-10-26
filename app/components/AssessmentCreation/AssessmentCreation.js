import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'
import { modalTopic } from '../Helpers/helperContent'
import { Label, Body } from '../Global/Text.ts'
import { ButtonPrimary, ButtonClose, ButtonSecondary } from '../Global/Buttons'

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
    // this.setState({amountPerAssessor: Math.round(e.target.value)}) // NOTE: I not sure whether this round has to be there. It looked superfluous but i haven't testet it thoroughly
    this.setState({amountPerAssessor: e.target.value})
    // this.estimateGasCost()
  }

  cancelButton () {
    if (this.state.step > 1 && this.state.step < 4) {
      this.setState({step: this.state.step - 1})
    } else {
      let url = window.location.host
      window.location.href = 'http://' + url + '/#/concepts/'
    }
  }

  actionButton () {
    let step = this.state.step
    switch (step) {
      case 1:
        this.setState({step: 2})
        this.estimateGasCost()
        break
      case 2:
        this.loadConceptContractAndCreateAssessment()
        this.setState({step: 3})
        break
      case 3:
      case 4:
        this.cancelButton()
        break
      case 5:
        // TODO handle retry
        console.log('this is not yet handled...')
    }
  }

  estimateGasCost () {
    this.props.estimateGasCost(
      this.props.match.params.address,
      this.state.amountPerAssessor,
      (cost) => {
        this.setState({gasEstimate: cost, step: 2})
      }
    )
  }

  loadConceptContractAndCreateAssessment () {
    let react = {
      transactionHash: (hash) => { this.setState({ step: 4, hash: hash }) },
      confirmation: (error, receipt) => {
        if (!error) {
          // show confirmation to first timers only
          if (!this.props.visits.hasCreatedAssessment) {
            this.props.setModal(modalTopic.AssessmentCreation)
            this.props.hasDoneX('hasCreatedAssessment')
          }
          let receiptAddress = receipt.events[0].raw.topics[2]
          let assessmentAddress = '0x' + receiptAddress.substring(26, receiptAddress.length)
          this.props.history.push('/assessment/' + assessmentAddress)
        } else {
          this.props.setModal(modalTopic.AssessmentCreationFailed)
          this.setState({step: 5})
        }
      },
      error: () => { this.setState({step: 5}) }

    }
    this.props.loadConceptContractAndCreateAssessment(
      this.props.match.params.address,
      this.state.amountPerAssessor,
      react
    )
  }

  render () {
    let BottomPartContent = null
    let step = this.state.step

    switch (step) {
      case 1:
        BottomPartContent = h(cardBodyContainer, [
          h(cardBodyColumnLeft, [
            h(cardContainerParameters, [
              h(Label, 'ASSESSOR FEE'),
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
              h(Label, 'NO. OF ASSESSORS'),
              h(cardTextObject, '5')
            ]),
            h(cardContainerParameters, [
              h(Label, 'TOTAL COST'),
              h(cardTextObject, this.state.amountPerAssessor * 5 + ' AHA')
            ])
          ]),
          h(cardBodyColumnRight, [
            h(helpTextContainer, [
              h(Label, 'Whats the assessment fee?'),
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
              h(Label, 'TRANSACTION COST'),
              h(cardTextObject, this.state.gasEstimate.toString().substring(0, 8) + ' ETH')
            ]),
            h(cardContainerParameters, [
              h(Label, 'EQUAL TO'),
              h(cardTextObject, (this.state.gasEstimate * 220).toString().substring(0, 4) + ' USD')
            ])
          ]),
          h(cardBodyColumnRight, [
            h(helpTextContainer, [
              h(Label, 'A transaction fee?'),
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
              h(cardTextObjectHelp, 'Click on the ‘Confirm’ button in MetaMask to send your assessment to Ethereum for creation.')
            ]),
            h(helpAlertContainer, [
              h(helpAlertText, 'Dont see MetaMask?'),
              h(cardTextObjectHelp, 'Try clicking on the MetaMask icon in your browser\'s extension section')
            ])
          ])
        ])
        break
      case 4:
        BottomPartContent = h(cardBodyContainer, [
          h(cardBodyColumnFull, [
            h(helpTextContainer, [
              h(cardTextObjectHelp, 'We\'ll notify you once your assessment has been processed and created by Ethereum. \n  This can take a from few seconds to a few minutes.')
            ])
          ])
        ])
        break
      case 5:
        BottomPartContent = h(cardBodyContainer, [
          h(cardBodyColumnFull, [
            h(helpTextContainer, [
              h(cardTextObjectHelp, 'Ooops, looks like something did not check out with your transaction. Scream loud and try again in 15 seconds.') // TODO we need better help. simply trying again will most likely fail for the same reasons, costing them gas.
            ])
          ])
        ])
    }
    const actionButtonText = Object.freeze({
      1: 'Next',
      2: 'Send Transaction',
      3: 'Cancel',
      4: 'Done',
      5: 'Retry'
    })

    let footerContent
    if (step <= 3) {
      footerContent = [
        h(ButtonSecondary, {onClick: this.cancelButton.bind(this)}, 'Previous')
      ]
    } else {
      footerContent = [h(footerRow, [
        h(step === 4 ? icoSuccess : icoFailure),
        h(Body, {feedBack: step === 4 ? 'success' : 'failed'}, step === 4 ? 'Your assessment is being created on Ethereum.' : 'Your transaction could not be submitted.')
      ])]
    }
    if (step !== 3) {
      footerContent.push(h(ButtonPrimary, {
        onClick: this.actionButton.bind(this),
        active: step === 2
      }, actionButtonText[step]))
    }

    let stageActivity = Object.freeze({
      1: 'How much would you like to pay your assessors?',
      2: 'Next, we\'ll send your assessment to Ethereum.',
      3: 'Please complete the transaction via Metamask',
      4: 'Your transaction was sent to Ethereum',
      5: 'Ooops. Looks like your transaction was not submitted.'
    })

    return h(createAssessmentContainer, [
      h(createAssessmentTopWrapper, [
        h(createAssessmentContainerProgressBar, [
          // REFACTOR: use general Purpose progressBar
          h(createAssessmentProgressBarObject, {current: step === 1, past: step > 1}),
          h(createAssessmentProgressBarObject, {current: step === 2, past: step > 2}),
          h(createAssessmentProgressBarObject, {current: step === 3, past: step > 3}),
          h(createAssessmentProgressBarObject, {current: step === 4, past: step > 4})
        ]),
        this.state.step < 4 ? h(ButtonClose, {onClick: this.cancelButton.bind(this)}) : null
      ]),
      h(createAssessmentWrapper, [
        h(createAssessmentCardContainer, [
          h(createAssessmentHeader, [
            h(cardLabelTitle, 'Concept'),
            h(cardTextTitle, this.props.concept.name),
            h(createAssessmentTextDesc, stageActivity[step])
          ]),
          BottomPartContent
        ]),
        h(createAssessmentFooter, {highlight: step > 3 ? (step === 4 ? 'success' : 'failure') : ''}, footerContent)
      ])
    ])
  }
}

export default AssessmentCreation

// styles

const createAssessmentContainer = styled('div').attrs({ className: 'flex flex-column items-center w-100 h-100 bg-white pa2 tc' })`
`

const createAssessmentTextDesc = styled('h4').attrs({className: 'f4 fw4 tl mt4 mb0'})`
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

const ButtonGroup = styled('div').attrs({className: 'flex flex-row justify-between br1 ph3 f4 mt2'})`
background-color: #d6dffa;
`
const AmountPerAssessor = styled('input').attrs({className: 'flex w-25 tl pa1 bn bg-transparent '})`
`
const AHAUnit = styled('div').attrs({className: 'f5 mid-gray'})`
`
// replaced by global input component
// const AmountPerAssessor = styled('input').attrs({className: 'flex w-25 tl pa1 bn bg-transparent '})`
// `
const helpTextContainer = styled('div').attrs({className: 'flex flex-column h-100 justify-end mv3 tl'})`
`

const helpAlertContainer = styled('div').attrs({className: 'flex flex-column h-100 justify-end mv3 tl br1 bw1'})`
`

const helpAlertText = styled('span').attrs({className: 'f4 mv0'})`
color: ${props => props.theme.negativeRed}
`

const cardTextObjectHelp = styled('h5').attrs({className: 'flex f4 fw4 lh-copy tl mv2'})`
color: ${props => props.theme.textBody};
`

// step 2

const cardContainerParameters = styled('div').attrs({className: 'flex w-100 flex-column items-start fw4 mv3'})`
`

const cardTextObject = styled('h4').attrs({className: 'f4 fw4 tl mv1'})`
color: ${props => props.theme.secondary};
`

// step 4

// Custom styles no longer necessary for Step 4

const createAssessmentFooter = styled('div').attrs({
  className: 'flex flex-row w-100 items-center justify-between pa3 shadow-4'
})`
margin-top: 1px;
background-color: ${props => props.highlight ? (props.highlight === 'success' ? props.theme.positiveGreen : props.theme.negativeRed) : '#F5F5FF'};
`

// end states

const footerRow = styled('div').attrs({className: 'flex flex-row w-100 items-center'})`
`

const icoSuccess = styled('div').attrs({className: 'flex br-100 mr3'})`
width: 24px;
height: 24px;
background-color: ${props => props.theme.positiveGreenContrast};
`

const icoFailure = styled('div').attrs({className: 'flex br-100 mr3'})`
width: 24px;
height: 24px;
background-color: ${props => props.theme.negativeRedContrast};
`
