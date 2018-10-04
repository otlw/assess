import { connect } from 'react-redux'
import ProgressAndInputBar from './ProgressAndInputBar.js'
import { setInputBar } from '../../../store/navigation/actions'
import { confirmAssessor, commit, reveal, storeDataOnAssessment } from '../../../store/assessment/asyncActions'

const mapStateToProps = (state, ownProps) => {
  return {
    assessmentAddress: ownProps.assessmentAddress,
    userAddress: state.ethereum.userAddress,
    stage: state.assessments[ownProps.assessmentAddress].stage,
    userStage: state.assessments[ownProps.assessmentAddress].userStage,
    cost: state.assessments[ownProps.assessmentAddress].cost,
    checkpoint: state.assessments[ownProps.assessmentAddress].checkpoint,
    endtime: state.assessments[ownProps.assessmentAddress].endTime,
    inputType: state.navigation.inputBar
  }
}

const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal,
  storeDataOnAssessment,
  setInputBar
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressAndInputBar)
