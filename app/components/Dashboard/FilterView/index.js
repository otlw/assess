import { connect } from 'react-redux'
import FilterView from './FilterView'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.ethereum.userAddress
  }
}

export default connect(mapStateToProps)(FilterView)
