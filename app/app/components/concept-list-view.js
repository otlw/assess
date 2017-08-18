const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../scripts/actions')
const Link = require('react-router-dom').Link


function mapStateToProps (state) {
    return {
        concepts: state.appState.conceptList
    }
}
class ConceptList extends Component {
    componentDidMount () {
        this.props.dispatch(actions.getConceptEvents())
    }

    render () {
        const props = this.props

        return h('div', {}, [

            h('button', {
                onClick: (event) => {
                    event.preventDefault()
                    this.props.dispatch(actions.showNewConceptForm())
                }
            }, 'Create Concept'),
            h('br'), h('br'),
            h('div',
              [
                props.concepts.map(concept => (
                    h('div',{key: concept.address}, [
                        h(Link, { to: "/concept/" +  concept.address }, [
                            concept.name]),
                        h('div',{style: {fontStyle: 'italic', fontSize: '0.8em', textColor: 'grey'}},
                          [concept.address]),
                        h('hr')
                    ])
                ))
              ]),
        ])
    }
}

module.exports = connect(mapStateToProps)(ConceptList)
