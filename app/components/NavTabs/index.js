import { connect } from 'react-redux'
import NavTabs from './NavTabs.js'

const mapStateToProps = state => {
  return {
    showNavTabs: state.navigation.showNavTabs,
  }
}

const mapDispatchToProps = {
}

// export default connect(mapStateToProps, mapDispatchToProps)(NavTabs)
