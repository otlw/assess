import h from 'react-hyperscript'
import { Component } from 'react'
import styled from 'styled-components'

export class cardCredential extends Component {
  render () {
    return (
      h(credentialContainer, [
        h(credentialContainerInfo, [
          h(credentialObjectText, [
            h(credentialLabel, 'Credential'),
            h(credentialTitleText, this.props.assessment.conceptData),
            h(credentialLabel, 'Awarded To Alex Singh'),
          ]),
          h(credentialDecoCircleSmall),
          h(credentialDecoCircleLarge),
          h(credentialDecoTriSmall),
          h(credentialDecoTriLarge),
        ]),
        h(credentialContainerBottom, [
          h(credentialContainerScore, [
            h(credentialLabel, 'Score'),
            h(credentialObjectScore, '8.1'),
          ]),
          h(buttonPrimaryShare, 'Share')
        ])
      ])
    )
  }
}

const credentialContainer = styled('div').attrs({className: 'flex flex-column ma3 br2 shadow-4'
})`
height: 420px; width: 300px;
background: linear-gradient(144.78deg, rgba(61, 204, 196, 0.7) 0%, #CCFFFC 100%);
`

const credentialContainerInfo = styled('div').attrs({
  className: 'relative flex content-start flex-column w-100 h-50 pa3'
})`
`

const credentialObjectText = styled('div').attrs({
  className: 'flex flex-column'
})`
`

const credentialLabel = styled('h6').attrs({
  className: 'f5 mv1 ttu uppercase'
})`
color: #2E998A;
`

const credentialTitleText = styled('h3').attrs({
  className: 'f3 mv1'
})`
color: #006657;
`

const credentialDecoCircleLarge = styled('div').attrs({
  className: 'absolute w4 h4 br-100 o-50 shadow-5'
})`
background-color: #4CB8B1;
right: -80px;
bottom:0px;
`

const credentialDecoCircleSmall = styled('div').attrs({
  className: 'absolute w1 h1 br-100 o-50 shadow-5'
})`
background-color: #4CB8B1;
left: 48px;
bottom:0px;
`

const credentialDecoTriLarge = styled('div').attrs({
  className: 'absolute o-50'
})`
width: 0;
height: 0;
border-left: 80px solid transparent;
border-right: 80px solid transparent;
border-bottom: 80px solid #4CB8B1;
left: -80px;
bottom: 8px;
transform:rotate(75deg);
`

const credentialDecoTriSmall = styled('div').attrs({
  className: 'absolute o-50'
})`
width: 0;
height: 0;
border-left: 16px solid transparent;
border-right: 16px solid transparent;
border-bottom: 16px solid #4CB8B1;
right: 80px;
bottom:-24px;
transform:rotate(24deg);
`

const credentialContainerBottom = styled('div').attrs({className: 'flex flex-row content-between w-100 h-50 pb3 ph3'
})`
`

const credentialContainerScore = styled('div').attrs({className: 'flex flex-column self-end items-center'
})`
`

const credentialObjectScore = styled('div').attrs({className: 'flex self-end h3 w3  fw4 f2 shadow-4 items-center content-center align-center br-pill bg-dark-blue near-white ttu uppercase'
})`
background-color: #2E998A; width: 80px; height: 80px;
`

const buttonPrimaryShare = styled('div').attrs({className: 'flex self-end ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'
})`
background-color: #2E998A;
`





export default cardCredential
