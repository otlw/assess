import { Component } from 'react'
import { connect } from 'react-redux'
import Header from './components/Header'
import { NavTabs } from './components/NavTabs'
import AssessmentBoard from './components/AssessmentBoard'
import CertificateBoard from './components/CertificateBoard'
import ConceptBoard from './components/ConceptBoard'
import AssessmentView from './components/AssessmentView'
import h from 'react-hyperscript'
import { HashRouter, Route } from 'react-router-dom'
import styled, {ThemeProvider} from 'styled-components'
import Modal from './components/Helpers/Modal'
import { modalTopic } from './components/Helpers/helperContent'

const theme = {
  primary: '#322EE5',
  secondary: '#3D4B66',
  tertiary: '#D7E0FA',
  textBody: '#6B6C99',
  bgPrimary: '#E8E9F7',
  bgSecondary: '#F5F5FF',
  positiveGreen: '#15D49A',
  negativeRed: '#FF3333',
  inactiveGray: '#CCCCCC',
  dark: '#29434e',
  lightgrey: '#d3d3d3',
  blue: '#2F80ED',
  lightblue: '#70a5f9',
  yellow: '#fff700',
  lightgreen: '#A5FBA9'
}

// the main frame on which everything is displayed.
// It will call connect() when mounting the header) and render the other views once
// the necessary info (web3 instance, networkId, userAddress) is there

// If connect() is unable to instanciate the web3 object (and userAddress) for various reasons, a warning
// screen will be displayed instead of the App

// The connect() function also listens for changes in metamask and, if any are detected, triggers a reload of
// the entire window

export class App extends Component {
  render () {
    // use the mainDisplay variable to know wether a warning screen related to MM
    let modal = this.props.modal
    if (modal === modalTopic.NoMetaMask ||
        modal === modalTopic.educateAboutMetaMask ||
        modal === modalTopic.UnlockMetaMask) {
      return h(Modal, {topic: modal})
    }
    // else, there is an account, just display the normal App
    return (
      h(HashRouter, [
        h(ThemeProvider, {theme},
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
        )
      ])
    )
  }
}

const appContainer = styled('div').attrs({className: 'relative flex flex-column w-100 h-100'})``

const mapStateToProps = state => {
  return {
    loadedWeb3: state.ethereum.isConnected && state.ethereum.userAddress && state.ethereum.networkID && state.ethereum.webSocketIsConnected,
    modal: state.navigation.modal
  }
}

export default connect(mapStateToProps)(App)
