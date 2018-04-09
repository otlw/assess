import { connect } from 'react-redux'
import AssessmentsBoard from '../components/AssessmentsBoard'

const mapStateToProps = state => {
  return {
    assessmentList: state.assessmentList,
    userAddress: state.userAddress
  }
}

export default connect(mapStateToProps)(AssessmentsBoard)
