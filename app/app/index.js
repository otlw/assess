const render = require('react-dom').render
const h = require('react-hyperscript')
const Root = require('./components/root')
const composeStore = require('./scripts/store')
const {STORAGE_KEY, initialState} = require('./config.js')
window.addEventListener('load', start)

function start () {
  const container = document.getElementById('main')
  const data = getStorage()
  const store = composeStore(data || initialState)
  render(h(Root, {store}), container)
}

function getStorage () {
  return localStorage[STORAGE_KEY] ? JSON.parse(localStorage[STORAGE_KEY]) : null
}

function setStorage(data) {
  localStorage[STORAGE_KEY] = JSON.stringify(data)
}
