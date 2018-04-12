import { Component } from 'react'
import h from 'react-hyperscript'

    // styles
const itemStyle={
  frameStyle : {
    display:"inline-block",
    border: '0.5px solid lightgrey', 
    margin: '0.3em',
    padding:"0.3em"
  },
  titleStyle:{
    'fontSize': '24px', 
    'fontStyle': 'bold'
  }
} 
    
export class AssessmentItem extends Component {
  render () {
    const assessment = this.props.assessment

    return h('div', {style:itemStyle.frameStyle}, [
      h('br'),
      h('div', itemStyle.titleStyle, 'Assessment'),
      h('div', assessment.address),
      h('div', itemStyle.titleStyle, 'stage'),
      h('div', assessment.stage),
      h('br')
    ])
  }
}

export default AssessmentItem
