const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const Route = require('react-router-dom').Route

const ConceptListView = require('./concept-list-view')
const AddConceptView = require('./concept-form')

function mapStateToProps (state) {
    return {
        currentView: state.appState.currentView
    }
}

class mainView extends Component {
    render(){
        const props = this.props

        return h('.app-main.column', [
            h('h1', ['Fathom!']),
            this.renderMainView()
        ])
    }

    renderMainView () {
        const props = this.props
        switch (props.currentView.name) {
        case 'concepts':
            return h(ConceptListView)
        case 'new-concept-form':
            return h(AddConceptView)
        default:
            return h('h1.whoops', 'Whoops state poorly constructed')
        }
    }
}

module.exports = connect(mapStateToProps)(mainView)
