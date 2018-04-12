import { connect } from 'react-redux'
import AssessorStatus from '../components/assessmentView/AssessorStatus'
import { confirmAssessor } from '../actions/conceptActions'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {
  confirmAssessor
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessorStatus)
