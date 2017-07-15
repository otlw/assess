const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../scripts/actions')

const Form = require('./concept-form')
function mapStateToProps (state) {
  return {
    subview: state.appState.currentView.subview,
  }
}
class ConceptView extends Component {
  render () {
    const props = this.props

    return h('.concept-view', {
        style: {
        },
      }, [
        this.renderSubview(),
      ])

  }

  renderSubview () {
    switch (this.props.subview) {
      case 'concept-form':
        return h(Form)
      default:
        return h('', [
          h('button', {
            onClick: (event) => {
              event.preventDefault()
              this.props.dispatch(actions.showConceptForm())

            }
          }, 'Create Concepts')
        ])
    }
  }
}

module.exports = connect(mapStateToProps)(ConceptView)
