import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import Dashboard from './components/Dashboard'
import AssessmentView from './components/AssessmentView'
import Header from './components/Header'
import rootReducer from './reducers'///web3Reducer.js'
import h from 'react-hyperscript'

import {HashRouter, Route} from 'react-router-dom'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
console.log('defaultState', store.getState())

render(
  h(Provider, {store},
    h(HashRouter, [
	  	h('div', [
		  	h(Header),
	        h(Route, {exact: true, path: '/', component: Dashboard}),
	        h(Route, {path: '/assessment/:id', component: AssessmentView})
      	])
    ])),
  document.getElementById('root')
)
