const extend = require('xtend')
const actions = require('../scripts/actions')
const {initialState} = require('../config.js')

module.exports = reduceApp


function reduceApp (state, action) {
    const appState = state.appState
    switch (action.type) {
    case 'SHOW_NEW_CONCEPT_FORM':
        return extend(appState, {
            currentView: {
                name: 'new-concept-form',
            }
        })
    case 'UPDATE_FORM_DATA':
        const currentView = appState.currentView
        currentView.formData = appState.currentView.formData || {}
        currentView.formData[action.key] = action.value
        return extend(appState, {
            currentView,
        })
    case 'ADD_CONCEPT':
        return extend(appState, {
            conceptList: [
                ...appState.conceptList,
                {
                    name: action.name,
                    address: action.address,
              }
            ]
        })
    case 'CLEAR_CONCEPTS':
        return extend(appState, {
            conceptList: []
        })
    case 'SHOW_CONCEPT_VIEW':
        return extend(appState, {
            currentView: {
                name: 'concept',
            }
        })
    default: return appState
    }
}
