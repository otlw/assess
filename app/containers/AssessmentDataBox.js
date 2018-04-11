import { connect } from 'react-redux'
import AssessmentData from '../components/AssessmentData'

const mapStateToProps = state => {
  return {
    assessment: state.assessment
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentData)
