import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Dashboard from './components/Dashboard'
import AssessmentView from './components/AssessmentView'
import Header from './components/Header'
import rootReducer from './reducers'/// web3Reducer.js'
import h from 'react-hyperscript'
import {ThemeProvider} from "styled-components"

import {HashRouter, Route} from 'react-router-dom'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
console.log('defaultState', store.getState())

const theme={
  primary:"#546e7a",
  light:"#819ca9",
  dark:"#29434e",
  lightgrey:"#d3d3d3"
}

render(
  h(Provider, {store},
    h(HashRouter, [
      h(ThemeProvider,{theme},
        h("div", [
          h(Header),
          h("div",{style:{margin:"8px"}},[
            h(Route, {exact: true, path: '/', component: Dashboard}),
            h(Route, {path: '/assessment/:id', component: AssessmentView})
          ])
        ]
      ))
    ])),
  document.getElementById('root')
)
