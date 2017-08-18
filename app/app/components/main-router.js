const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const Route = require('react-router-dom').Route

const ConceptRouter = require('./concept-router.js')
const MainView = require('./main-view.js')

function mapStateToProps (state) {
    return {
        currentView: state.appState.currentView
    }
}

class App extends Component {
  render () {
    const props = this.props

    return h('div',
      [
          h(Route, {exact: true, path:'/', component: MainView}),
          h(Route, {path: '/concept', component: ConceptRouter}),
      ])
  }

}

module.exports = connect(mapStateToProps)(App)
