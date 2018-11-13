// first load networkID and address from MetaMask, and then load persisted state and instantiate store
import { Component } from 'react'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import { Provider } from 'react-redux'
import Web3 from 'web3'
import rootReducer from './store/index'
import h from 'react-hyperscript'

let loadingLocalStorageComponent = h('div', 'loading local storage') // TODO add a proper component

type State = {
  status: 'initial'| 'UserRejection'| 'NoMetaMask'| 'UnlockMetaMask'| 'loaded'|null;
  networkID: number;
  userAddress: string;
}
type Props = {
  children?: any
}

export class PersistStoreInstantiator extends Component<Props, State> {
  constructor (props: any) {
    super(props)
    this.state = {
      status: 'initial',
      networkID: 0,
      userAddress: ''
    }
  }

  async componentDidMount () {
    // load networkID and user address to use as rootKey for the data persistor

    // Modern dapp browsers...
    let web3: any
    if ((window as any)['ethereum']) {
      web3 = new Web3((window as any)['ethereum'])
      try {
        // Request account access if needed
        await (window as any)['ethereum'].enable()
      } catch (error) {
        // User denied account access...
        // TODO setup 'user rejection modal'
        console.log('user rejection')
        this.setState({ status: 'UserRejection' })
      }
    } else if ((window as any)['web3']) { // Legacy dapp browsers...
      web3 = new Web3((window as any)['web3'].currentProvider)
      // Acccounts always exposed
    } else { // Non-dapp browsers...
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      this.setState({ status: 'NoMetaMask' })// TODO this modal shouldnt be able to be closed
    }

    web3 = new Web3((window as any)['web3'].currentProvider)
    let accounts = await web3.eth.getAccounts()
    let networkID = await web3.eth.net.getId()

    if (accounts.length === 0) {
      this.setState({ status: 'UnlockMetaMask' })
    } else {
      this.setState({ status: 'loaded', networkID, userAddress: accounts[0] })
    }
  }

  render () {
    switch (this.state.status) {
    case null:
    case 'initial':
      return h('div', 'Loading metamask')

    case 'loaded':
    // Metamask data loaded
    // Configure redux-persist store

      const persistConfig = {
        key: this.state.networkID + this.state.userAddress,
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

      return h(Provider, { store },
        h(PersistGate, { loading: loadingLocalStorageComponent, persistor },
          this.props.children
        )
      )
    default:
      return h('div', this.state.status)
    }
  }
}

export default PersistStoreInstantiator
