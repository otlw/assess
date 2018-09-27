import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import h from 'react-hyperscript'
import {ThemeProvider}from 'styled-components'
import throttle from 'lodash/throttle'
import { saveState } from './utils.js'

import App from './App'
import rootReducer from './store/'// / web3Reducer.js'

const theme = {
  primary: '#546e7a',
  light: '#819ca9',
  veryLight: '#b8cad3',
  dark: '#29434e',
  lightgrey: '#d3d3d3',
  blue: '#2F80ED',
  lightblue: '#70a5f9',
  yellow: '#fff700',
  lightgreen: '#A5FBA9'
}

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
console.log('defaultState', store.getState())

// subscribe to any change in store and save it (at most once per second)
store.subscribe(throttle(() => {
  saveState(store.getState())
}, 1000))

render(
  h(Provider, {store},
    h(ThemeProvider, {theme},
        h(App)
      )),
  document.getElementById('root')
)
