// import dependencies
import { connect } from 'react-redux'
// components
import {TxList} from './TxList'
// actions
import { confirmAssessor, commit, reveal, storeDataOnAssessment, refund } from '../../../store/assessment/asyncActions'

// map state to props
const mapStateToProps = (state: any) => {
	return {
		// get transactions from state.transactions
		// filter for transactions matching currently selected user account
    transactions: Object.values(state.transactions).filter(
    	tx => tx
      // tx => (tx.sender === state.ethereum.userAddress)
    ),   
    userAddress: state.ethereum.userAddress, 
	}
}

// map dispatch to props
const mapDispatchToProps = {
  confirmAssessor,
  commit,
  reveal,
  storeDataOnAssessment,
  refund
}

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(TxList)
