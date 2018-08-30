import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './AppContainer.js'
import rootReducer from './reducers'// / web3Reducer.js'
import h from 'react-hyperscript'
import styled from 'styled-components'
import throttle from 'lodash/throttle'
import { saveState } from './utils.js'

const topLevelStyles = styled('div')`
font-family:'system-ui', 'Helvetica Neue', sans-serif;
font-weight: 400;
`
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
  h(Provider, {store}, h(topLevelStyles, [h(App)])),
  document.getElementById('root')
)
