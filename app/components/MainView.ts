import { Component } from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'
import { HashRouter, Route } from 'react-router-dom'
import styled from 'styled-components'

import Header from './Header'
import { NavTabs } from './NavTabs'
import AssessmentBoard from './AssessmentBoard'
import CertificateBoard from './CertificateBoard'
import ConceptBoard from './ConceptBoard'
import AssessmentView from './AssessmentView'
import Modal from './Helpers/Modal'
import HelperBar from './Helpers/HelperBar'
import { TxList } from './Notifications/TxList'

import {State} from '../store'
import { Transaction } from '../store/transaction/reducer'

// the main frame on which everything is displayed.
// It will call connect() when mounting the header)

interface IMainViewProps {
  transactions: Transaction[]
}

class MainView extends Component<IMainViewProps> {
  render () {
    return (
      h(HashRouter, [
        h('div', [
          h(Header),
          h(TxList, { transactions: this.props.transactions }),
          h(appContainer, [
            h(NavTabs),
            h(HelperBar),
            h(Modal),
            h(Route, {exact: true, path: '/', component: AssessmentBoard}),
            h(Route, {exact: true, path: '/concepts/', component: ConceptBoard}),
            h(Route, {path: '/assessment/:id', component: AssessmentView}),
            h(Route,{path: '/certificates', exact: true, component: CertificateBoard}),
            h(Route, {path: '/certificates/:address', component: CertificateBoard})
            ])
          ])
      ])
    )
  }
}

const appContainer = styled('div').attrs({className: 'relative flex flex-column w-100 h-100'})``

const mapStateToProps = (state:State) => {
  return {
    transactions: Object.values(state.transactions)
  }
}

export default connect(mapStateToProps)(MainView)
