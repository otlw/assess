import { connect } from 'react-redux'
import AssessmentCreation from './AssessmentCreation.js'
import { hasDoneX, setModal } from '../../store/navigation/actions'
import {
  loadConceptContractAndCreateAssessment,
  estimateAssessmentCreationGasCost } from '../../store/concept/asyncActions'

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps.match.params.address)
  return {
    concept: state.concepts[ownProps.match.params.address],
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
