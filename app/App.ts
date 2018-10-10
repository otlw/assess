import h from 'react-hyperscript'
import MetamaskLoader from './components/Loaders/MetamaskLoader'
import HistoryLoader from './components/Loaders/HistoryLoader'
import MainView from './components/MainView'

export const App = () => {
  return h(MetamaskLoader, [
    h(HistoryLoader, [
      h(MainView)
    ])
  ])
}
