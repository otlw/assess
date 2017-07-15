const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect

const actions = require('../scripts/actions')

function mapStateToProps (state) {
  return {
    formData: state.appState.currentView.formData
  }
}
class ConceptForm extends Component {
  constructor (...args) {
    super(...args)
    this.state = {formData: {}}
  }
  render () {
    const props = this.props

    return h('.form-container', {
        style: {
        },
      }, [
        h('form.connect-form', {
          onSubmit: (event) => {
            event.preventDefault()
            // props.dispatch(actions.createNewConcept())
            console.log(props.formData)
          }
        }, [
          h('.label', 'Parent Concept:'),
          h('input', {
            onChange: this.updateFormData.bind(this),
            name: 'parents',
          }),
          h('.label', 'Concept Name:'),
          h('input', {
            onChange: this.updateFormData.bind(this),
            name: 'concept',
          }),
          h('button', {
            type: 'submit',
          }, 'Create Concept'),
        ]),
      ])
  }

  updateFormData (event) {
    this.props.dispatch(actions.updateFormData(event.target.name, event.target.value))
  }
}

module.exports = connect(mapStateToProps)(ConceptForm)
