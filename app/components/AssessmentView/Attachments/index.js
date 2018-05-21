import { connect } from 'react-redux'
import { storeData } from '../../../actions/assessmentActions'
import MeetingPoint from './MeetingPoint.js'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  storeData
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPoint)
