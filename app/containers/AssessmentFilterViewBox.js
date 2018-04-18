import { connect } from 'react-redux'
import AssessmentFilterView from '../components/AssessmentFilterView'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.ethereum.userAddress
  }
}

export default connect(mapStateToProps)(AssessmentFilterView)
