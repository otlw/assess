import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import buttonTertiary from '../../global/buttonTertiary.ts'
var h = require('react-hyperscript')

const MeetingPointForm = props => {
  const { handleSubmit, submitting } = props
  return (
    h(formMp, {onSubmit: handleSubmit}, [
      h(Field, {
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

export const formMp = styled('form').attrs({className: 'flex w-100 flex-row'})``
