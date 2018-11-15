import h from 'react-hyperscript'
import MetamaskLoader from './components/Loaders/MetamaskLoader'
import DataLoader from './components/Loaders/DataLoader'
import MainView from './components/MainView'

export const App = () => {
  return h(MetamaskLoader, [
    h(DataLoader, [
      h(MainView)
    ])
  ])
}
