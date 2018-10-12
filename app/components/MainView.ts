import { Component } from 'react'
import h from 'react-hyperscript'
import { HashRouter, Route } from 'react-router-dom'
import styled from 'styled-components'
import { LinkCloseRight } from './Global/Links'

import Header from './Header'
import { NavTabs } from './NavTabs'
import AssessmentBoard from './AssessmentBoard'
import CertificateBoard from './CertificateBoard'
import ConceptBoard from './ConceptBoard'
import AssessmentView from './AssessmentView'
import Modal from './Helpers/Modal'
import HelperBar from './Helpers/HelperBar'
import TxList from './Notifications/TxList'

// the main frame on which everything is displayed.
// It will call connect() when mounting the header)

export interface IMatch {[key: string]: any}

export default class MainView extends Component {
  render () {
    return (
      h(HashRouter, [
        h('div', [
          h(Header),
          h(TxList),
          h(HelperBar),
          h(Modal),
          h(appContainer, [
            h(Route, {
              exact: true,
              path: '/',
              render: () => h('div', [h(NavTabs), h(AssessmentBoard)])
            }),
            h(Route, {
              path: '/assessment/:id',
              render: ( {match}: IMatch ) => h(subContainer, [
                h(LinkCloseRight, {to: '/'}), h(AssessmentView, {match})
              ])
            }),
            h(Route, {
              exact: true,
              path: '/concepts/',
              render: () => h(ConceptBoard)
            }),
            h(Route,{
              path: '/certificates',
              exact: true,
              // render: () => h('div', [h(NavTabs), h(HelperBar), h(Modal), h(CertificateBoard)])
              component: CertificateBoard
            }),
            h(Route, {
              path: '/certificates/:address',
              render: ( {match}:IMatch ) => h(subContainer, [
                h(LinkCloseRight, {to: '/certificates'}), h(CertificateBoard, {match})
              ])
            })
          ])
        ])
      ])
    )
  }
}

const appContainer = styled('div').attrs({className: 'relative flex flex-column w-100 h-100'})``
const subContainer = appContainer.extend`
  padding-top: 20px;
`
