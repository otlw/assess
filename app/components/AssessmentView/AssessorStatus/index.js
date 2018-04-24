import { connect } from 'react-redux'
import AssessorStatus from './AssessorStatus.js'
import { confirmAssessor, commit, reveal } from '../../../actions/assessmentActions'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessorStatus)
