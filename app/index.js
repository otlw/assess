import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import AssessmentDashboardApp from './components/AssessmentDashboardApp'
import AssessmentViewApp from './components/AssessmentViewApp'
import HeaderBox from './containers/HeaderBox'
import rootReducer from './reducers/web3Reducer.js'
import h from 'react-hyperscript'

import {HashRouter, Route} from 'react-router-dom'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

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
