import { render } from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {App} from './App'
import rootReducer from './store/index'// / web3Reducer.js'
import h from 'react-hyperscript'
import  styled, {ThemeProvider}from 'styled-components'
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

const theme = {
  primary: '#322EE5',
  secondary: '#3D4B66',
  tertiary: '#D7E0FA',
  textBody: '#6B6C99',
  bgPrimary: '#E8E9F7',
  bgSecondary: '#F5F5FF',
  positiveGreen: '#15D49A',
  positiveGreenContrast: '#004d36', // Used for text or other contrasting elements on top of positiveGreen
  negativeRed: '#ff6666',
  negativeRedContrast:'#4d0000', // Used for text or other contrasting elements on top of negativeRed
  inactiveGray: '#CCCCCC',
  dark: '#29434e',
  lightgrey: '#d3d3d3',
  blue: '#2F80ED',
  lightblue: '#70a5f9',
  yellow: '#fff700',
  lightgreen: '#A5FBA9'
}

// subscribe to any change in store and save it (at most once per second)
store.subscribe(throttle(() => {
  saveState(store.getState())
}, 1000))

render(
  h(Provider, {store},
    h(ThemeProvider, {theme},
      h(topLevelStyles, [h(App)])
     )),
  document.getElementById('root')
)
