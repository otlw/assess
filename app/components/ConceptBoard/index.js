import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import { LoadingStage } from '../../constants.js'
import ConceptBoard from './ConceptBoard.js'
import { setNotificationBar } from '../../actions/navigationActions'
import {
  loadConceptContractAndCreateAssessment,
  loadConceptsFromConceptRegistery,
  estimateAssessmentCreationGasCost } from '../../actions/conceptActions.js'

const mapStateToProps = state => {
  return {
    concepts: state.concepts,
    loadedConcepts: (state.loading.concepts === LoadingStage.Done),
    loading: state.loading,
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
