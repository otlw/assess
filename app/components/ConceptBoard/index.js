import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import ConceptBoard from './ConceptBoard.js'
import { setNotificationBar } from '../../store/navigation/actions'
import {
  loadConceptContractAndCreateAssessment,
  loadConceptsFromConceptRegistery,
  estimateAssessmentCreationGasCost } from '../../store/concept/asyncActions'

const mapStateToProps = state => {
  return {
    concepts: state.concepts,
    transactions: Object.values(state.transactions).filter(
      tx => (tx.data === 'makeAssessment')
    )
  }
}

const mapDispatchToProps = {
  load: loadConceptsFromConceptRegistery,
  loadConceptContractAndCreateAssessment,
  estimateAssessmentCreationGasCost,
  setNotificationBar: setNotificationBar
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(ConceptBoard)
