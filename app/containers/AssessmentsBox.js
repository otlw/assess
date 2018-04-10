import { connect } from 'react-redux'
import AssessmentsBoard from '../components/AssessmentsBoard'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.userAddress
  }
}

export default connect(mapStateToProps)(AssessmentsBoard)
