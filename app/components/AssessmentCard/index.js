import { connect } from 'react-redux'
import { compose } from 'redux'
// import { LoadComponent } from '../hocs/loadComponent.js'
import AssessmentCard from './AssessmentCard.js'

// import {setDashboardTab} from '../../actions/navigationActions.js'
// import { fetchLatestAssessments } from '../../actions/assessmentActions.js'
import { toggleCardVisibility } from '../../actions/assessmentActions.js'
// toggleCardVisibility (address, hiddenStatus)

// const mapStateToProps = state => {
//   return {
    // assessments: state.assessments,
    // userAddress: state.ethereum.userAddress,
    // networkID: state.ethereum.networkID
//   }
// }

const mapDispatchToProps = {
	toggleCardVisibility
  // setDashboardTab,
  // load: fetchLatestAssessments
}

// export default compose(
  // connect(mapStateToProps, mapDispatchToProps),
  // LoadComponent
// )(AssessmentCard)
export default connect(null, mapDispatchToProps)(AssessmentCard)