import { connect } from 'react-redux'
import CreationBar from './CreationBar.js'
import { loadConceptContractAndCreateAssessment, loadConceptsFromConceptRegistery } from '../../../actions/conceptActions.js'

const mapStateToProps = state => {
  return {
    concepts: state.concepts,
    isConnected: state.ethereum.isConnected,
    networkID: state.ethereum.networkID
  }
}

const mapDispatchToProps = {
  loadConceptContractAndCreateAssessment,
  loadConceptsFromConceptRegistery
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationBar)
