import { connect } from 'react-redux'
import CreationBar from './CreationBar.js'
import { loadConceptContractAndCreateAssessment } from '../../../actions/conceptActions.js'

const mapStateToProps = state => {
  return {
    concepts: state.concepts
  }
}

const mapDispatchToProps = {
  loadConceptContractAndCreateAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationBar)
