const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect

function mapStateToProps (state) {
  return {}
}
class ConceptView extends Component {
  render () {
    const props = this.props

    return h('.concept-view', {
        style: {
        },
      }, [
        h('button', {}, 'Create Concepts'),
      ])

  }
}

module.exports = connect(mapStateToProps)(ConceptView)
