import { Component } from 'react'
import { connect } from 'react-redux'
import Header from './components/Header'
import {NavTabs} from './components/NavTabs'
// import AssessmentFilterView from './components/AssessmentFilterView'
import Dashboard from './components/Dashboard'
import CertificateList from './components/CertificateList'
import AssessmentView from './components/AssessmentView'
import h from 'react-hyperscript'
import { HashRouter, Route } from 'react-router-dom'
import styled, {ThemeProvider} from 'styled-components'

const theme = {
  primary: '#546e7a',
  light: '#819ca9',
  veryLight: '#b8cad3',
  dark: '#29434e',
  lightgrey: '#d3d3d3',
  blue: '#2F80ED',
  lightblue: '#70a5f9',
  yellow: '#fff700'
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
    // use the mainDisplay variable to know wether to display the App or a warning screen
    let mainDisplay = this.props.mainDisplay
    let warningScreen = null

    if (mainDisplay === 'UnlockMetaMask') {
      // if user needs to enter password
      warningScreen = h('p', 'You need to unlock Metamask by entering your password.\n')
    } else if (mainDisplay === 'NoMetaMask') {
      // if user doesn't have MetaMask
      warningScreen = h('p', "You don't have the MetaMask browser extension that allows to use this app.\n Please Download it to use the features of this interface")
    } else if (mainDisplay === 'UndeployedNetwork') {
      // if there arent anydeployed contract on this network
      warningScreen = h('p', "You are connected to a network on which you haven't deployed contracts. Please use an appropriate script")
    } // else, just display the normal App

    return (
      h(HashRouter, [
        h(ThemeProvider, {theme},
          warningScreen === null
            ? h('div', [
              h(Header),
              this.props.loadedWeb3
                ? (h(appContainer, [
                  (!this.props.showNavTabs ? h(NavTabs) : null),
                  h(Route, {exact: true, path: '/', component: Dashboard}), // TODO: Once the AssessmentCreation MR has been merged, replace this component with AssessmentFilterView
                  h(Route, {path: '/concepts/', render: () => h('div', 'monkeys all the way!')}), // TODO after concept-creation is merged in
                  h(Route, {path: '/assessment/:id', component: AssessmentView}),
                  h(Route, {path: '/certificates/', component: CertificateList})
                ]))
                : h('div', 'Loading web3')
            ]) : warningScreen
        )
      ])
    )
  }
}

const appContainer = styled('div').attrs({className: 'flex flex-column w-100 pa2'})``

const mapStateToProps = state => {
  return {
    loadedWeb3: state.ethereum.isConnected && state.ethereum.userAddress && state.ethereum.networkID && state.ethereum.webSocketIsConnected,
    mainDisplay: state.navigation.mainDisplay,
    showNavTabs: state.navigation.showNavTabs
  }
}

export default connect(mapStateToProps)(App)
