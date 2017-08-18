const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../scripts/actions')
const Route = require('react-router-dom').Route

const Concept = require('./concept-view')

function mapStateToProps (state) {
    return {
        concepts: state.appState.conceptList
    }
}

class ConceptRouter extends Component {
    render(){
        const props = this.props

        return h('div', {
            },[
                h(Route, {path: "/concept/:concept", component:Concept})
            ]
        )
    }
}

class Child extends Component {
    render() {
       return h('h1', [
           this.props.match.params.concept])
    }
}


module.exports = connect(mapStateToProps)(ConceptRouter)
