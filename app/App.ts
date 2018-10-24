import h from 'react-hyperscript'
import MetamaskLoader from './components/Loaders/MetamaskLoader'
import MainView from './components/MainView'

export const App = () => {
  return h(MetamaskLoader, [
    h(MainView)
  ])
}
