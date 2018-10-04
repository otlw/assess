import { Field, reduxForm } from 'redux-form'
import inputField from '../../global/inputField.ts'
import buttonTertiary from '../../global/buttonTertiary.ts'
var h = require('react-hyperscript')

const MeetingPointForm = props => {
  const { handleSubmit, submitting } = props
  return (
    h('form', {onSubmit: handleSubmit}, [
      h(inputField, {
        name: 'data',
        component: 'input',
        type: 'text',
        placeholder: 'E.g. A Google Hangout'
      }),
      h(buttonTertiary, {
        type: 'submit',
        disabled: submitting
      }, 'Submit')
    ])
  )
}

export default reduxForm({
  form: 'meeting'
})(MeetingPointForm)
