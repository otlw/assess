import { Component } from 'react'
import { connect } from 'react-redux'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import AssessmentView from './components/AssessmentView'
import h from 'react-hyperscript'
import { HashRouter, Route } from 'react-router-dom'
import {ThemeProvider} from 'styled-components'

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
// The connect() function also listens for changes in metamask and, if any are detected, triggers a reload of
// the entire window
export class App extends Component {
  render () {
    return (
      h(HashRouter, [
        h(ThemeProvider, {theme},
          this.props.mainDisplay === 'Main'
            ? h('div', [
              h(Header),
              this.props.loadedWeb3
                ? (h('div', {style: {margin: '8px'}}, [
                  h(Route, {exact: true, path: '/', component: Dashboard}),
                  h(Route, {path: '/assessment/:id', component: AssessmentView})
                ]))
                : h('div', 'Loading web3')
            ])
            : this.props.mainDisplay === 'UnlockMetaMask'
              ? h('p', 'You need to unlock Metamask by entering your password.\n')
              : this.props.mainDisplay === 'NoMetaMask'
                ? h('p', "You don't have the MetaMask browser extension that allows to use this app.\n Please Download it to use the features of this interface")
                : this.props.mainDisplay === 'UndeployedNetwork'
                  ? h('p', "You are connected to a network on which you haven't deployed contracts. Please use an appropriate script")
                  : h('p', 'unexpected view')
        )
      ])
    )
  }
}

const mapStateToProps = state => {
  return {
    loadedWeb3: state.ethereum.isConnected && state.ethereum.userAddress && state.ethereum.networkID && state.ethereum.webSocketIsConnected,
    mainDisplay: state.navigation.mainDisplay
  }
}

export default connect(mapStateToProps)(App)
