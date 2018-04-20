import { connect } from 'react-redux'
import CreationBar from './CreationBar.js'
import { loadConceptContractAndCreateAssessment } from '../../../actions/conceptActions.js'

const mapStateToProps = state => {
  return {
    conceptList: state.concepts
  }
}

const mapDispatchToProps = {
  loadConceptContractAndCreateAssessment
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationBar)
