import { connect } from 'react-redux'
import ConceptList from '../components/ConceptList'
import { loadConceptContractAndCreateAssessment } from '../actions/async.js'

const mapStateToProps = state => {
  return {
    conceptAddressList: state.conceptAddressList,
  }
}


export default connect(mapStateToProps)(ConceptList)
