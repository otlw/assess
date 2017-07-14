const Component = require('react').Component
const Provider = require('react-redux').Provider
const h = require('react-hyperscript')
const App = require('./main')

module.exports = class Root extends Component {
  render () {
    return h(Provider, {
      store: this.props.store,
    }, [
      h(App),
    ])
  }
}
