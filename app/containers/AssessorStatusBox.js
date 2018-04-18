import { connect } from 'react-redux'
import AssessorStatus from '../components/assessmentView/AssessorStatus'
import { confirmAssessor, commit, reveal } from '../actions/assessmentActions'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessorStatus)
