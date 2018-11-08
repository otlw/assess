import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { App } from './App'
import rootReducer from './store/index'
import h from 'react-hyperscript'
import styled, { ThemeProvider } from 'styled-components'
import throttle from 'lodash/throttle'
import { State } from './store'
import { getLocalStorageKey } from './utils.js'

const topLevelStyles = styled('div')`
font-family:'system-ui', 'Helvetica Neue', sans-serif;
font-weight: 400;
`
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
console.log('defaultState', store.getState())

const theme = {
  primary: '#322EE5',
  secondary: '#3D4B66',
  tertiary: '#D7E0FA',
  textBody: '#6B6C99',
  bgPrimary: '#E8E9F7',
  bgSecondary: '#F5F5FF',
  positiveGreen: '#15D49A',
  positiveGreenContrast: '#004d36', // Used for text or other contrasting elements on top of positiveGreen
  negativeRed: '#ff8080',
  negativeRedContrast: '#800000', // Used for text or other contrasting elements on top of negativeRed
  inactiveGray: '#CCCCCC',
  nearWhite: '#f5f5f5',
  dark: '#29434e',
  lightgrey: '#d3d3d3',
  blue: '#2F80ED',
  lightblue: '#70a5f9',
  yellow: '#fff700',
  lightgreen: '#A5FBA9'
}

const saveState = (state: State) => {
  if (state.ethereum.isConnected) {
    try {
      let stateToSave = {
        assessments: state.assessments,
        concepts: state.concepts,
        lastUpdatedAt: state.ethereum.lastUpdatedAt,
        deployedConceptRegistryAt: state.ethereum.deployedConceptRegistryAt,
        deployedFathomTokenAt: state.ethereum.deployedFathomTokenAt,
        visits: state.navigation.visits
      }
      let key = getLocalStorageKey(state.ethereum.networkID, state.ethereum.userAddress, state.ethereum.web3)
      const serializedState = JSON.stringify(stateToSave)
      localStorage.setItem(key, serializedState) // eslint-disable-line no-undef
    } catch (err) {
      console.log('error saving state', err)
    }
  } else {
    console.log('do not store Store yet')
  }
}

// subscribe to any change in store and save it (at most once per second)
store.subscribe(throttle(() => {
  saveState(store.getState())
}, 500))

render(
  h(Provider, { store },
    h(ThemeProvider, { theme },
      h(topLevelStyles, [h(App)])
    )),
  document.getElementById('root')
)
