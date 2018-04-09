import { Component } from 'react'
import AssessmentsColumn from '../components/AssessmentsColumn'

var h = require('react-hyperscript')

export class AssessmentsBoard extends Component {
  render () {
    let assessmentList = this.props.assessmentList
    // for testing purposes
    // let assessmentList=[{
    //   address:"0x958E248Fa0dAb6862Dda122e1723E8000A0D2543",
    //   assessee:"0xf2a2E600Eb309A5d8A17C18756F65608bD5ce5Db",
    //   conceptAddress:"0xb2290D79d50ABa3A75E9714466EEf803e39f0bC8",
    //   conceptData:"B",
    //   cost:"10",
    //   size:"5",
    //   stage:"1",
    // },{
    //   address:"0x958E248Fa0dAb6862Dda122e1723E8000A0D2543",
    //   assessee:"0xf2a2E600Eb3092228A17C18756F65608bD5ce5Db",
    //   conceptAddress:"0xb2290D79d50ABa3A75E9714466EEf803e39f0bC8",
    //   conceptData:"B",
    //   cost:"10",
    //   size:"5",
    //   potAssessors:["0xf2a2E600Eb309A5d8A17C18756F65608bD5ce5Db"],
    //   stage:"1",
    // },{
    //   address:"0x958E248Fa0dAb6862Dda122e1723E8000A0D2543",
    //   assessee:"0xf2a2E600Eb309A5d8A17C18756F65608bD5ce5Db",
    //   conceptAddress:"0xb2290D79d50ABa3A75E9714466EEf803e39f0bC8",
    //   conceptData:"B",
    //   cost:"10",
    //   size:"5",
    //   stage:"2",
    // },{
    //   address:"0x958E248Fa0dAb6862Dda122e1723E8000A0D2543",
    //   assessee:"0xf2a22200Eb309A5d8A17C18756F65608bD5ce5Db",
    //   conceptAddress:"0xb2290D79d50ABa3A75E9714466EEf803e39f0bC8",
    //   conceptData:"B",
    //   cost:"10",
    //   size:"5",
    //   stage:"6",
    //   assessors:["0xf2a2E600Eb309A5d8A17C18756F65608bD5ce5Db"],
    // }]
    let userAddress = this.props.userAddress
    if (this.props.assessmentList.length === 0) {
      return null
    } else {
      // style
      const mainFrameStyle = {style: {border: '0.5px solid lightgrey', borderRadius: '1em', padding: '1em', marginTop: '2em'}}
      let potentialAssessments
      let currentAssessments
      let pastAssessments
      if (userAddress === 'publicView') {
        potentialAssessments = assessmentList.filter((a) => {
          return (a.stage === '0' || a.stage === '1' || a.stage === '2')
        })
        currentAssessments = assessmentList.filter((a) => {
          return (a.stage === '4' || a.stage === '5')
        })
        pastAssessments = assessmentList.filter((a) => {
          return (a.stage === '3' || a.stage === '6' || a.stage === '7')
        })
      } else {
        potentialAssessments = assessmentList.filter((a) => {
          return ((a.stage === '0' && a.assessee === userAddress) ||
            ((a.stage === '1' || a.stage === '2') && (a.assessee === userAddress || (a.potAssessors && a.potAssessors.indexOf(userAddress) > -1))))
        })
        currentAssessments = assessmentList.filter((a) => {
          return (a.stage === '4' || a.stage === '5') && (a.assessee === userAddress || a.assessors.indexOf(userAddress) > -1)
        })
        pastAssessments = assessmentList.filter((a) => {
          return (a.stage === '3' || a.stage === '6' || a.stage === '7') && (a.assessee === userAddress || a.assessors.indexOf(userAddress) > -1)
        })
      }
      return h('div', mainFrameStyle, [
        h(AssessmentsColumn, {assessmentList: potentialAssessments, userAddress: userAddress, columnName: 'Potential Assessments'}),
        h(AssessmentsColumn, {assessmentList: currentAssessments, userAddress: userAddress, columnName: 'Current Assessments'}),
        h(AssessmentsColumn, {assessmentList: pastAssessments, userAddress: userAddress, columnName: 'Past Assessments'})
      ])
    }
  }
}

export default AssessmentsBoard
