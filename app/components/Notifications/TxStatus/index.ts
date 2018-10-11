import { connect } from 'react-redux'
import TxStatus from './TxStatus'
import { removeTransaction } from '../../../store/transaction/actions'
import { State } from '../../../store'

const mapStateToProps = (state:State) => {
  return {
    networkID: state.ethereum.networkID
  }
}

const mapDispatchToProps = {
  removeTX: removeTransaction
}

export default connect(mapStateToProps, mapDispatchToProps)(TxStatus)
