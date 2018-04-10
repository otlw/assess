import { Component } from 'react'
var h = require('react-hyperscript')

export class ConceptList extends Component {

  render() {
    //styles
    const titleStyle={style:{fontSize:"1.5em",margin:"2em 0",fontStyle:"bold"}}
    const mainFrameStyle={style:{textAlign:"center",border:"0.5px solid lightgrey",borderRadius:"0.5em",padding:"1em",margin:"1em"}}
    const conceptFrameStyle={style:{textAlign:"center",border:"0.5px solid lightgrey",borderRadius:"0.5em",margin:"1em 20%",paddingTop:"0.5em"}}

    if (this.props.conceptAddressList.length===0){
      return null
    } else {
      return h('div',mainFrameStyle,[
        h('div','List of Concepts in this Concept Registry'),
        h('div',this.props.conceptAddressList.map((address,k)=>{
        const fieldStyle={style: {'fontSize': '1.2em','fontStyle':"bold"}}
        const valueStyle={style: {'fontSize': '0.9em'}}
          return h('div',conceptFrameStyle ,[
              h('div',fieldStyle, "Concept"),
              h('div',valueStyle, address),
          ])
        }))
      ])
    }
  }
}

export default ConceptList
