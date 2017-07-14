const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect

const ConceptView = require('./concept-view')

function mapStateToProps (state) {
  return {
    currentView: state.appState.currentView
  }
}
class App extends Component {
  render () {
    const props = this.props

    return h('.app-main.column', {
        style: {
        },
      }, [
        this.renderTopBar(),
        h('.row', {},[
          this.renderSideBar(),
          h('.main-content', {},[
            this.renderMainView()
          ]),
        ]),
      ])

  }

  renderMainView () {
    const props = this.props
    switch (props.currentView.name) {
      case 'concepts':
        return h(ConceptView)
      default:
        return h('h1.whoops', 'Whoops state poorly constructed')
    }
  }

  renderTopBar () {
    return h('h1.top-bar', 'Fathom')
  }

  renderSideBar () {
    return h('.side-bar', 'side-bar')
  }
}

module.exports = connect(mapStateToProps)(App)
