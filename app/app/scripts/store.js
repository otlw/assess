const createStore = require('redux').createStore
const applyMiddleware = require('redux').applyMiddleware
const thunkMiddleware = require('redux-thunk').default

const rootReducer = require('../reducers')
module.exports = configureStore

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

function configureStore (initialState) {
    return createStoreWithMiddleware(rootReducer, initialState)
}
