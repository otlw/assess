const extend = require('xtend')
const actions = require('../scripts/actions')
const {initialState} = require('../config.js')

module.exports = reduceApp


function reduceApp (state, action) {
  switch (action.type) {
    default: return state.appState
  }


}
