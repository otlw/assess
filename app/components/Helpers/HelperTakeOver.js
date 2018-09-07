import styled from 'styled-components'
// import h from 'react-hyperscript'
var h = require('react-hyperscript')
// import { Component } from 'react'

export const HelperTakeOver = (props) => {
  console.log('trying to render helpertakover', props)
  // render () {
  let text
  let title = props.topic
  switch (title) {
    case 'UnlockMetaMask':
      text = 'You need to unlock Metamask by entering your password.\n'
      break
    case 'NoMetaMask':
      text = "You don't have the MetaMask browser extension that allows to use this app.\n Please Download it to use the features of this interface"
      break
    case 'educateAboutMetaMask':
      text = 'There is this cool thing called Metamask, we need so you can be safe and foxxy.'
      break
    case 'UndeployedNetwork':
      text = "You are connected to a network on which you haven't deployed contracts. Please use an appropriate script"
      break
    default:
      text = 'OOOpsi, this case was not caught...'
  }
  console.log('text will be', text)
  return (
    h(appContainerObscurer, [
      h(modalContainer, [
        h(modalHeader, [
          h(modalTextTitle, title)
        ])
        // commenting those in will break stuff
        // h(modalBody, [
        //   h(modalTextBody, text)
        // ]),
        // h(modalFooter, [
        //   h(modalButtonPrimary, 'blub')
        // ])
      ])
    ])
  )
}

export default HelperTakeOver

export const appContainerObscurer = styled('div').attrs({className: 'absolute flex items-center justify-center pa4'})`
background-color: hsla(0%, 0%, 0%, 0.9);`

export const modalContainer = styled('div').attrs({className: 'relative flex flex-column w-100 mw6 pa  br1 shadow-4 bg-near-white'})`
`

export const modalHeader = styled('div').attrs({className: 'flex flex-column items-center justify-center pa3 bb b--light-gray bg-light-yellow'})`
`

export const modalTextTitle = styled('h4').attrs({className: 'f4 dark-gray tc'})``

export const modalBody = styled('div').attrs({className: 'flex flex-column items-center justify-center pa3 b--gray ph5'})

export const modalTextBody = styled('p').attrs({className: 'f5 gray tl lh-copy'})``

export const modalFooter = styled('div').attrs({className: 'flex flex-column items-center justify-center pa4-ns pa2'})``

export const modalButtonPrimary = styled('button').attrs({className: 'flex ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'})`
background-color: #116187;`
