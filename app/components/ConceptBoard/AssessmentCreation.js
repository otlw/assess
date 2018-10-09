import { Component } from 'react'
import styled from 'styled-components'
import h from 'react-hyperscript'
import { modalTopic } from '../Helpers/helperContent'
import { Label } from '../Global/Text.ts'
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
      this.props.cancelCreation()
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
        this.setState({step: 3})
        break
      case 3:
        this.loadConceptContractAndCreateAssessment()
        break
      case 4:
        this.props.cancelButton()
        break
      case 5:
        // TODO handle retry
        console.log('this is not yet handled...')
    }
  }

  estimateGasCost () {
    this.props.estimateGasCost(
      this.props.conceptAddress,
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
          // this.props.setModal(modalTopic.AssessmentCreation)
          // let receiptAddress = receipt.events[0].raw.topics[2]
          // let assessmentAddress = '0x' + receiptAddress.substring(26, receiptAddress.length)
          // this.props.history.push('/assessment/' + assessmentAddress)
        } else {
          console.log('uiuiu not sure why this happened..., please try to reproduce anf file a bug-issue')
          this.props.setModal(modalTopic.AssessmentCreationFailed)
          this.setState({step: 5})
        }
      },
      error: () => { this.setState({step: 5}) }

    }
    this.props.loadConceptContractAndCreateAssessment(
      this.props.conceptAddress,
      this.state.amountPerAssessor,
      react
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
              h(cardLabel, 'TRANSACTION COST'),
              h(cardTextObject, this.state.gasEstimate.toString().substring(0, 8) + ' ETH')
            ]),
            h(cardContainerParameters, [
              h(cardLabel, 'EQUAL TO'),
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
              h(cardTextObjectHelp, 'Click on the ‘Send’ button in MetaMask to send your assessment to Ethereum for creation.')
            ])
          ])
        ])
        break
      case 4:
        BottomPartContent = h(cardBodyContainer, [
          h(cardBodyColumnFull, [
            h(helpTextContainer, [
              h(cardTextObjectHelp, 'We\'ll notify you once your assessment has been processed and created by Ethereum. \n  This can take a from few minutes to a few seconds.')
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
      2: 'Next',
      3: 'Send Transaction',
      4: 'Home',
      5: 'Retry'
    })

    let footerContent
    if (this.state.step <= 3) {
      footerContent = [
        h(ButtonSecondary, {onClick: this.cancelButton.bind(this)}, 'Previous')
      ]
    } else if (this.state.step === 4) {
      // alex insert positive footerBar here
      footerContent = [h('div', [
        h('span', 'i am a green positive dot'),
        h('span', 'Your assessment is being created on ethereum.')
      ])]
    } else {
      // negativ here
      footerContent = [h('div', [
        h('span', 'i am a red angry dot'),
        h('span', 'Ooops, looks like your transaction could not be submitted.')
      ])]
    }
    footerContent.push(h(ButtonPrimary, {
      onClick: this.actionButton.bind(this),
      active: this.state.step === 3
    }, actionButtonText[this.state.step]))

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
          h(createAssessmentProgressBarObject, {current: this.state.step === 1, past: this.state.step > 1}),
          h(createAssessmentProgressBarObject, {current: this.state.step === 2, past: this.state.step > 2}),
          h(createAssessmentProgressBarObject, {current: this.state.step === 3, past: this.state.step > 3}),
          h(createAssessmentProgressBarObject, {current: this.state.step === 4, past: this.state.step > 4})
        ]),
        this.state.step < 4 ? h(ButtonClose, {onClick: this.cancelButton.bind(this)}) : null
      ]),
      h(createAssessmentWrapper, [
        h(createAssessmentCardContainer, [
          h(createAssessmentHeader, [
            h(cardLabelTitle, 'Concept'),
            h(cardTextTitle, this.props.concept.name),
            h(createAssessmentTextDesc, stageActivity[this.state.step])
          ]),
          BottomPartContent
        ]),
        h(createAssessmentFooter, footerContent)
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

const ButtonGroup = styled('div').attrs({className: 'flex flex-row justify-between br1 ph3 f4'})`
background-color: #d6dffa;
`
const AmountPerAssessor = styled('input').attrs({className: 'flex w-25 tl pa1 bn bg-transparent '})`
`
const AHAUnit = styled('div').attrs({className: 'f5 mid-gray'})`
// replaced by global input component
// const AmountPerAssessor = styled('input').attrs({className: 'flex w-25 tl pa1 bn bg-transparent '})`
// `
const helpTextContainer = styled('div').attrs({className: 'flex flex-column h-100 justify-end mv3 tl'})`
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
