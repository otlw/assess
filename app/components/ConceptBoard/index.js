import { connect } from 'react-redux'
import { LoadingStage } from '../../constants.js'
import ConceptBoard from './ConceptBoard.js'

const mapStateToProps = state => {
  return {
    concepts: state.concepts,
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ConceptBoard)
