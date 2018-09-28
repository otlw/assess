// import dependencies
// pkgs
import { connect } from 'react-redux'
import { compose } from 'redux'
// components
import { LoadComponent } from '../../hocs/loadComponent.js'
// actions

// map state to props
const mapStateToProps = state => {
	return {
		// mappings key to value
		// transactions from state.transactions
		transactions: Object.values(state.transactions).filter(
			tx => {}
			)
	}
}

// map dispatch to props
const mapDispatchToProps = {
	// mappings here
	// key: value
}

// export composed component
  // connect mapState, mapDispatch
