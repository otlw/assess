// import { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
var h = require('react-hyperscript')

const MeetingPointForm = props => {
  const { handleSubmit, submitting } = props
  return (
    h('form', {onSubmit: handleSubmit}, [
      h('label', 'Add a Meeting Point: '),
      h(Field, {
        name: 'data',
        component: 'input',
        type: 'text',
        placeholder: 'e.g. a gitlab repo'
      }),
    h('button', { type: 'submit', disabled: submitting }, 'Submit')
    ])
  )
}

export default reduxForm({
  form: 'meeting'
})(MeetingPointForm)
