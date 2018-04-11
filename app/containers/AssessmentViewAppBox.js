import { connect } from 'react-redux'
import AssessmentViewApp from '../components/assessmentView/AssessmentViewApp'

const mapStateToProps = state => {
  return {
    assessments: state.assessments,
    userAddress: state.userAddress
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentViewApp)
