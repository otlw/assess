const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../scripts/actions')
const Link = require('react-router-dom').Link

function mapStateToProps (state) {
    return {
        conceptList: state.appState.conceptList
    }
}

class Concept extends Component {
    componentDidMount() {
        this.props.dispatch(actions.getConcept)
    }
    render () {
        const props = this.props
        const concept = this.props.conceptList.find(function(concept) {
            return concept.address = props.match.params.concept
        })

        console.log(props.conceptList)
        return h('h1', {}, [
            concept.name, concept.address
        ])
    }
} 

module.exports = connect(mapStateToProps)(Concept)
