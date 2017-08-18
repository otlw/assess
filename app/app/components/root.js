const Component = require('react').Component
const Provider = require('react-redux').Provider
const h = require('react-hyperscript')
const App = require('./main-router')

const Router = require('react-router-dom').HashRouter
const Route = require('react-router-dom').Route
const browserHistory = require('react-router-dom').browserHistory

module.exports = class Root extends Component {
  render () {
    return h(Provider, {
      store: this.props.store,
    }, [
        h(Router, {history: {browserHistory}}, [
            h(Route, {path: '/', component: App})
        ])
    ])
  }
}
