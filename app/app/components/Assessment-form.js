const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect

function mapStateToProps (state) {
  return {}
}
class AssessmentForm extends Component {
  render () {
    const props = this.props

    return h('.form-container', {
        style: {
        },
      }, [
        h('form.connect-form', {}, [
          h('input', {
            type: 'number',
            name: 'numberOfAssessors',
          }),
          h('input', {
            type: 'number',
            name: 'payment',
          }),
          h('input', {
            type: 'number',
            name: 'timeLength',
          }),
          h('button', {
            type: 'submit',
          }, 'Get Assessed'),
        ]),
      ])
  }
}

module.exports = connect(mapStateToProps)(AssessmentForm)
