import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import AssessmentDashboardApp from './components/AssessmentDashboardApp'
import AssessmentViewApp from './containers/AssessmentViewApp'
import HeaderBox from './containers/HeaderBox'
import rootReducer from './reducers'///web3Reducer.js'
import h from 'react-hyperscript'

import {HashRouter, Route} from 'react-router-dom'

console.log(rootReducer)

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
console.log('defualtState', store.getState())

render(
  h(Provider, {store},
	  h(HashRouter, [
	  	h('div', [
	  		h(HeaderBox),
		    h(Route, {exact: true, path: '/', component: AssessmentDashboardApp}),
		    h(Route, {path: '/assessment/:id', component: AssessmentViewApp})
      ])
	  ])),
  document.getElementById('root')
)
