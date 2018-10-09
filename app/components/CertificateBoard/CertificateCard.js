import h from 'react-hyperscript'
import {Label, Headline, Subheadline} from '../Global/Text.ts'
import styled from 'styled-components'

export const CertificateCard = (props) => {
  return (
    h(credentialContainer, [
      h(credentialContainerInfo, [
        h(credentialObjectText, [
          h(Label, 'Credential'),
          h(Headline, props.assessment.conceptData.name),
          h(Label, 'Awarded To You')
        ]),
        h(credentialDecoCircleSmall),
        h(credentialDecoCircleLarge),
        h(credentialDecoTriSmall),
        h(credentialDecoTriLarge)
      ]),
      h(credentialContainerBottom, [
        h(credentialContainerScore, [
          h(Label, 'Score'),
          h(Subheadline, props.assessment.finalScore)
        ]),
        h(buttonPrimaryShare, 'Share') // TODO this is where Bridger comes in!!
      ])
    ])
  )
}

export default CertificateCard

const credentialContainer = styled('div').attrs({className: 'flex flex-column ma3 br2 shadow-4 overflow-hidden'
})`
height: 420px; width: 300px;
background: linear-gradient(144.78deg, rgba(61, 204, 196, 0.7) 0%, #CCFFFC 100%);
`

const credentialContainerInfo = styled('div').attrs({
  className: 'relative flex content-start flex-column w-100 pa3'
})`
height: 60%;
`

const credentialObjectText = styled('div').attrs({
  className: 'flex flex-column'
})`
`

const credentialDecoCircleLarge = styled('div').attrs({
  className: 'absolute w4 h4 br-100 o-50 shadow-3'
})`
background-color: #4CB8B1;
right: -80px;
bottom:90px;
filter:blur(12px);
`

const credentialDecoCircleSmall = styled('div').attrs({
  className: 'absolute w1 h1 br-100 o-50 shadow-5'
})`
background-color: #4CB8B1;
left: 48px;
bottom:0px;
filter:blur(4px);
`

const credentialDecoTriLarge = styled('div').attrs({
  className: 'absolute o-50'
})`
width: 0;
height: 0;
border-left: 80px solid transparent;
border-right: 80px solid transparent;
border-bottom: 80px solid #4CB8B1;
left: -54px;
top: -38px;
transform:rotate(35deg);
filter:blur(14px);
z-index:-9;
`

const credentialDecoTriSmall = styled('div').attrs({
  className: 'absolute o-50'
})`
width: 0;
height: 0;
border-left: 16px solid transparent;
border-right: 16px solid transparent;
border-bottom: 16px solid #4CB8B1;
right: 96px;
bottom:-48px;
transform:rotate(24deg);
filter:blur(4px);
`

const credentialContainerBottom = styled('div').attrs({className: 'flex flex-row justify-between w-100 pb3 ph3'
})`
height: 40%;
`

const credentialContainerScore = styled('div').attrs({className: 'flex flex-column self-end items-center'
})`
`

const buttonPrimaryShare = styled('div').attrs({className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'
})`
background-color: #2E998A;
`
