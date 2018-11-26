import h from 'react-hyperscript'
import DataLoader from './components/Loaders/DataLoader'
import MainView from './components/MainView'

export const App = () => {
  return h(DataLoader, [
    h(MainView)
  ])
}
