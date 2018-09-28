import h from 'react-hyperscript'
import styled from 'styled-components'
import { Component } from 'react'
import {Props} from './index'
// import {Link} from 'react-router-dom'

// TODO HOW can we make this component dissappear? when the user clicks on somthing from the navbar?
// idea: if this is styled to be transparent, the user see's that stuff changes and that he has to click to close it.
export class Modal extends Component<Props> {
  closeScreen () {
    this.props.setModal(null)
  }

  nextScreen () {
    this.closeScreen()
    if (this.props.topic.followUp) {
      this.props.setModal(this.props.topic.followUp.target)
    }
  }

  render () {
    return (
      h(appContainerObscurer, [
        h(modalContainer, [
          h(modalHeader, [
            h(modalTextTitle, this.props.topic.title),
            h(modalHeaderObjectCircle),
            h(modalHeaderObjectTri),
            h(modalHeaderObjectTriLarger),
            h(modalHeaderObjectSquare)
          ]),
          h(modalBody, [
            h(modalTextBody, this.props.topic.text)
          ]),
          h(modalFooter, [
            h(modalButtonSecondary, {onClick: this.closeScreen.bind(this)}, 'Close'),
            this.props.topic.followUp
              ? h(modalButtonPrimary, {onClick: this.nextScreen.bind(this)}, 'Learn More')
              : null
          ])
        ])
      ])
    )
  }
}

export default Modal

export const appContainerObscurer = styled('div').attrs({className: 'absolute flex w-100 h-100 items-center justify-center pa4 z-999'})`
top:0px;
background-color: hsla(0, 0%, 10%, 0.8);
`

export const modalContainer = styled('div').attrs({className: 'relative flex flex-column w-100 mw6 pa br1 shadow-5 bg-near-white'})`
`

export const modalHeader = styled('div').attrs({className: 'relative flex flex-column items-center justify-center pa3 br1 bb b--light-gray'})`
min-height: 240px;
background: linear-gradient(144.78deg,hsla(246,58%,52%,0.7) 0%,hsla(246, 30%, 87%, 1) 100%);
`

export const modalHeaderObjectCircle = styled('div').attrs({className: 'absolute flex w1 h1 br-100 z-9'})`
top: 24px;
left: 20px;
background: hsla(245, 61%, 57%,0.25);
transform: skew(32deg, -12deg);
`

export const modalHeaderObjectSquare = styled('div').attrs({className: 'absolute flex w2 h2 z-9 o-30'})`
top: 40px;
right: 80px;
background: hsla(245, 61%, 57%,0.25);
transform: skew(59deg,-28deg);
`

export const modalHeaderObjectTri = styled('div').attrs({className: 'absolute o-50'})`
width: 0;
height: 0;
border-left: 16px solid transparent;
border-right: 16px solid transparent;
border-bottom: 16px solid hsla(245, 61%, 57%,0.25);
right: 96px;
bottom:24px;
transform:rotate(24deg);
filter:blur(1px);
`

export const modalHeaderObjectTriLarger = styled('div').attrs({className: 'absolute o-50'})`
width: 0;
height: 0;
border-left: 24px solid transparent;
border-right: 24px solid transparent;
border-bottom: 24px solid hsla(245, 61%, 57%,0.25);
left: 80px;
bottom:24px;
transform:rotate(147deg);
filter:blur(1px);
`

export const modalTextTitle = styled('h4').attrs({className: 'f3 dark-gray tc'})`
`

export const modalBody = styled('div').attrs({className: 'flex flex-column items-center justify-center pa3 b--gray ph5'})`
min-height:120px;
`

export const modalTextBody = styled('p').attrs({className: 'f4 gray tl lh-copy'})``

export const modalFooter = styled('div').attrs({className: 'flex flex-row items-center justify-around pa4-ns pa2'})``

export const modalButtonPrimary = styled('button').attrs({className: 'flex ph4 pv2 fw4 f5 mh2 shadow-4 items-center align-center br-pill bg-green near-white ttu uppercase'})`
background-color: #116187;
:hover {cursor:pointer;}
`

const modalButtonSecondary = styled('div').attrs({
  className: 'flex ph4 pv2 fw4 f5 mh2 items-center align-center br-pill dark-gray'
})`box-shadow: 0px 0px 0px 1px hsla(214, 100%, 31%, 0.1);
transition: 0.2s ease-in-out;
:hover {cursor:pointer; background: #ccc; color: #444;}
`
