import { connect } from 'react-redux'
import ConceptList from '../components/ConceptList'

const mapStateToProps = state => {
  return {
    conceptAddressList: state.conceptAddressList
  }
}

export default connect(mapStateToProps)(ConceptList)
