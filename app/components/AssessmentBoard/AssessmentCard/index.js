import { connect } from 'react-redux'
import AssessmentCard from './AssessmentCard.js'

import { setCardVisibility } from '../../../store/assessment/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    assessment: state.assessments[ownProps.assessment.address],
    transactions: Object.values(state.transactions).filter(x => x.address === ownProps.assessment.address)
  }
}

const mapDispatchToProps = {
  setCardVisibility
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentCard)
