import {Component} from 'react'
import { connect } from 'react-redux'
import h from 'react-hyperscript'
import { HashRouter, Route } from 'react-router-dom'
import styled from 'styled-components'

import Header from './components/Header'
import { NavTabs } from './components/NavTabs'
import AssessmentBoard from './components/AssessmentBoard'
import CertificateBoard from './components/CertificateBoard'
import ConceptBoard from './components/ConceptBoard'
import AssessmentView from './components/AssessmentView'
import Modal from './components/Helpers/Modal'
import { modalTopic } from './components/Helpers/helperContent.js'
import {State} from './store'


// the main frame on which everything is displayed.
// It will call connect() when mounting the header) and render the other views once
// the necessary info (web3 instance, networkId, userAddress) is there

// If connect() is unable to instanciate the web3 object (and userAddress) for various reasons, a warning
// screen will be displayed instead of the App

// The connect() function also listens for changes in metamask and, if any are detected, triggers a reload of
// the entire window

interface Props {
  loadedWeb3: boolean | "" | 0
  modal: string
}
export class App extends Component<Props> {
    // use the mainDisplay variable to know wether a warning screen related to MM
  render () {
    let modal = this.props.modal
    if (modal === modalTopic.NoMetaMask ||
        modal === modalTopic.EducateAboutMetaMask ||
        modal === modalTopic.UnlockMetaMask) {
      return h(Modal, {topic: modal})
    }

    // else, there is an account, just display the normal App
    return (
      h(HashRouter, [
        h('div', [
          h(Header),
          // h(HelperBar), // TODO
          this.props.loadedWeb3
            ? (h(appContainer,
                 modal
                 ? [h(NavTabs), h(Modal, {topic: modal})]
                 : [h(NavTabs),
                    h(Route, {exact: true, path: '/', component: AssessmentBoard}),
                    h(Route, {exact: true, path: '/concepts/', component: ConceptBoard}),
                    h(Route, {path: '/assessment/:id', component: AssessmentView}),
                    h(Route, {path: '/certificates/', component: CertificateBoard})
                   ])
              )
            : h('div', 'Loading web3')
        ])
      ])
    )
  }
}

const appContainer = styled('div').attrs({className: 'flex flex-column w-100'})`
font-family:'system-ui', 'Helvetica Neue', sans-serif;
font-weight: 400;
`

function mapStateToProps (state:State) {
  return {
    loadedWeb3: state.ethereum.isConnected && state.ethereum.userAddress && state.ethereum.networkID && state.ethereum.webSocketIsConnected,
    modal: state.navigation.modal
  }
}

export default connect(mapStateToProps)(App)
