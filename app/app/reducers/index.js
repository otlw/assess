const extend = require('xtend')

//
// Sub-Reducers take in the complete state and return their sub-state
//
const reduceApp = require('./app')

module.exports = rootReducer

function rootReducer (state, action) {
  // clone

  //
  // AppState
  //

  state.appState = reduceApp(state, action)

  return state
}

