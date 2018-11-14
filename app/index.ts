import { render } from 'react-dom'

import { App } from './App'
import { PersistStoreInstantiator } from './PersistStoreInstantiator'

import h from 'react-hyperscript'
import styled, { ThemeProvider } from 'styled-components'

const topLevelStyles = styled('div')`
font-family:'system-ui', 'Helvetica Neue', sans-serif;
font-weight: 400;
`

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
  negativeRedContrast: '#800000', // Used for text or other contrasting elements on top of negativeRed
  inactiveGray: '#CCCCCC',
  nearWhite: '#f5f5f5',
  dark: '#29434e',
  lightgrey: '#d3d3d3',
  blue: '#2F80ED',
  lightblue: '#70a5f9',
  yellow: '#fff700',
  lightgreen: '#A5FBA9'
}

render(
  h(ThemeProvider, { theme },
    h(PersistStoreInstantiator, {}, h(topLevelStyles, [h(App)]))
  ),
  document.getElementById('root')
)
