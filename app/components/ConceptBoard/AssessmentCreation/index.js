import { connect } from 'react-redux'
import AssessmentCreation from './AssessmentCreation.js'
import { hasDoneX, setModal } from '../../../store/navigation/actions'
import {
  loadConceptContractAndCreateAssessment,
  estimateAssessmentCreationGasCost } from '../../../store/concept/asyncActions'

const mapStateToProps = (state, ownProps) => {
  return {
    concept: state.concepts[ownProps.conceptAddress],
    visits: state.navigation.visits
  }
}

const mapDispatchToProps = {
  loadConceptContractAndCreateAssessment,
  estimateGasCost: estimateAssessmentCreationGasCost,
  setModal,
  hasDoneX
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentCreation)
