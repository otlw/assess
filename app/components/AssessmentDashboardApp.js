import { Component } from 'react'
import h from 'react-hyperscript'

import AssessmentFilterViewBox from '../containers/AssessmentFilterViewBox'
import AssessmentCreationBox from '../containers/AssessmentCreationBox'

export class AssessmentDashboardApp extends Component {

  componentWillMount () {
    // and finally call the other actions that fill the state
    // dispatch(loadConceptsFromConceptRegistery())
    // dispatch(fetchAssessmentsAndNotificationsFromFathomToken())
  }

  render () {
    return h('div', {style: {textAlign: 'center'}}, [
      h(AssessmentCreationBox),
      h(AssessmentFilterViewBox)
 	])
  }
}

export default AssessmentDashboardApp
