import { connect } from 'react-redux'
import { compose } from 'redux'
import { LoadComponent } from '../hocs/loadComponent.js'
import { LoadingStage } from '../../constants.js'
import ConceptBoard from './ConceptBoard.js'
import {loadConceptsFromConceptRegistery} from '../../store/concept/asyncActions'

const mapStateToProps = state => {
  return {
    concepts: state.concepts,
    loadedConcepts: (state.loading.concepts === LoadingStage.Done),
    loading: state.loading
  }
}

const mapDispatchToProps = {
  load: loadConceptsFromConceptRegistery
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  LoadComponent
)(ConceptBoard)
