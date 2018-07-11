import AssessmentLoader from '../hocs/AssessmentLoader.js'
import AssessmentData from './AssessmentData/'
var h = require('react-hyperscript')

export const AssessmentView = (props) => {
  let address = props.match.params.id
  return h(AssessmentLoader, {address, child: AssessmentData})
}
