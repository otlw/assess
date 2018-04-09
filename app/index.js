import React from 'react'
import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers/web3Reducer.js'
import h from 'react-hyperscript'


import {HashRouter, Route} from 'react-router-dom'


const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)


render(
	h(Provider,{store},
  h(HashRouter, [
    h(Route, {component: App})
  ])),
  document.getElementById('root')
)
