import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import { Provider } from 'react-redux'
import {App} from './App'
import rootReducer from './store/index'
import h from 'react-hyperscript'
import  styled, {ThemeProvider}from 'styled-components'

const topLevelStyles = styled('div')`
font-family:'system-ui', 'Helvetica Neue', sans-serif;
font-weight: 400;
`

// Configure redux-persist store

const persistConfig = {
  key: 'root',
  storage,
  whitelist:['assessments','concepts']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
let store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
)
let persistor = persistStore(store)

// - - -


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
  negativeRedContrast:'#800000', // Used for text or other contrasting elements on top of negativeRed
  inactiveGray: '#CCCCCC',
  nearWhite: '#f5f5f5',
  dark: '#29434e',
  lightgrey: '#d3d3d3',
  blue: '#2F80ED',
  lightblue: '#70a5f9',
  yellow: '#fff700',
  lightgreen: '#A5FBA9'
}


let loadingLocalStorageComponent=h('div','loading local storage') // TODO add a proper component

render(
  h(Provider, {store},
    h(ThemeProvider, {theme},
      h(PersistGate,{loading:loadingLocalStorageComponent,persistor},
        h(topLevelStyles, [h(App)])
      )
    )
  ),
  document.getElementById('root')
)
