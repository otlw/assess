import { connect } from 'react-redux'
import AssessmentData from './AssessmentData'

const mapStateToProps = (state) => {
  return {
    userAddress: state.ethereum.userAddress
  }
}
export default connect(mapStateToProps)(AssessmentData)
