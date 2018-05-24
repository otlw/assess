import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './components/AppContainer.js'
import rootReducer from './reducers'/// web3Reducer.js'
import h from 'react-hyperscript'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
console.log('defaultState', store.getState())

render(
  h(Provider, {store}, h(App)),
  document.getElementById('root')
)
