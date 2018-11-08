import { Component } from 'react'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import { Provider } from 'react-redux'
// import {App} from './App'
import rootReducer from './store/index'
import h from 'react-hyperscript'

let loadingLocalStorageComponent = h('div', 'loading local storage') // TODO add a proper component

type Props = {
  rootKey: string
  children?: any
}

export class PersistStoreInstantiator extends Component<Props> {
  constructor (props: Props) {
    super(props)
    this.state = {
      status: 'initial',
      networkID: 0,
      userAddress: ''
    }
  }

  render () {
    // Configure redux-persist store

    const persistConfig = {
      key: this.props.rootKey,
      storage,
      whitelist: ['assessments', 'concepts']
    }

    const persistedReducer = persistReducer(persistConfig, rootReducer)
    let store = createStore(
      persistedReducer,
      applyMiddleware(thunk)
    )
    let persistor = persistStore(store)

    // - - -

    console.log('defaultState', store.getState())

    return h(Provider, { store },
      h(PersistGate, { loading: loadingLocalStorageComponent, persistor },
        this.props.children
      )
    )
  }
}

export default PersistStoreInstantiator
