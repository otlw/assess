const extend = require('xtend')
const actions = require('../scripts/actions')
const {initialState} = require('../config.js')

module.exports = reduceApp


function reduceApp (state, action) {
  const appState = state.appState
  switch (action.type) {
    case 'SHOW_CONCEPT_FORM':
      return extend(appState, {
        currentView: {
          name: appState.currentView.name,
          subview: 'concept-form',
        }
      })
    case 'UPDATE_FORM_DATA':
      const currentView = appState.currentView
      currentView.formData = appState.currentView.formData || {}
      currentView.formData[action.key] = action.value
      return extend(appState, {
        currentView,
      })
    default: return appState
  }


}
