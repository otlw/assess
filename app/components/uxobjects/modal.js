import { Component } from 'react'
import styled from 'styled-components'
var h = require('react-hyperscript')

// component to display all assessors
class modal extends Component {
  render () {
    return (
      h(appContainerObscurer, [
        h(modalContainer, [
          h(modalHeader, [
            h(modalTextTitle, 'Title')
          ]),
          h(modalBody, [
            h(modalTextBody, 'This is the body text of the modal')
          ]),
          h(modalFooter, [
            h(modalButtonPrimary)
          ])
        ])
      ])
    )
  }
}

const appContainerObscurer = styled('div').attrs({className: 'absolute flex items-center justify-center pa4'})`
background-color: hsla(0%, 0%, 0%, 0.9);`

const modalContainer = styled('div').attrs({className: 'relative flex flex-column w-100 mw6 pa  br1 shadow-4 bg-near-white'})`
`

const modalHeader = styled('div').attrs({className: 'flex flex-column items-center justify-center pa3 bb b--light-gray bg-light-yellow'})`
`

const modalTextTitle = styled('h4').attrs({className: 'f4 dark-gray tc'})``

const modalBody = styled('div').attrs({className: 'flex flex-column items-center justify-center pa3 b--gray ph5'})

const modalTextBody = styled('p').attrs({className: 'f5 gray tl lh-copy'})``

const modalFooter = styled('div').attrs({className: 'flex flex-column items-center justify-center pa4-ns pa2'})``

const modalButtonPrimary = styled('button').attrs({className: 'flex ph4 pv2 fw4 f5 shadow-4 items-center align-center br-pill bg-dark-blue near-white ttu uppercase'})`
background-color: #116187;`

export default modal
