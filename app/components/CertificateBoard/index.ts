import { connect } from 'react-redux'
import {Component} from 'react'
import CertificateList from './CertificateList'
import {State} from '../../store'
import {match} from 'react-router-dom'
import h from 'react-hyperscript'

import {Assessment} from '../../store/assessment/reducer'
import {fetchCredentials} from '../../store/assessment/asyncActions'

type Props = {
  assessments: Assessment[]
  userAddress: string,
  loggedInUser: string,
  networkID: number
  fetchCredentials: typeof fetchCredentials
}

class CertificateLoader extends Component<Props> {
  componentDidMount() {
    this.props.fetchCredentials(this.props.userAddress)
  }

  render() {
    return h(CertificateList, {assessments: this.props.assessments, userAddress: this.props.userAddress, loggedInUser: this.props.loggedInUser})
  }
}

const mapStateToProps = (state:State, ownProps:{match:match<{address:string}>}) => {
  let userAddress = ownProps.match.params.address
  if(!userAddress) userAddress = state.ethereum.userAddress

  let credentials = Object.values(state.assessments).filter(assessment => {
    console.log(userAddress)
    return (assessment.assessee.toLowerCase() === userAddress.toLowerCase() &&
            assessment.finalScore > 50 )
  })
  return {
    loggedInUser: state.ethereum.userAddress,
    assessments: credentials,
    userAddress,
    networkID: state.ethereum.networkID,
  }
}

const mapDispatchToProps = {
  fetchCredentials
}

export default connect(mapStateToProps, mapDispatchToProps)(CertificateLoader)
