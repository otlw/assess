//Dropdown Component : props: 
// list ["string1","string2",etc], 
// selectedID:integer, 
// set: function (integer)=>effect

import { Component } from 'react'
var h = require('react-hyperscript')

//should be moved to style folder when it's created
//or stay here to be more easily reused
const dropdownStyle={
  button:{
    color:"red"
  },
  dropdown: {
      position: "relative",
      display: "inlineBlock",
      textAlign:"left"
  },
  dropdownContent: {
      display: "none",
      position: "absolute",
      backgroundColor: "#f9f9f9",
      minWidth: "8em",
      boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
      zIndex: "1",
  },
  item:{
    border:"1px solid red",
    padding:"0.3em"
  },
  itemHovered:{
    border:"1px solid red",
    color:"blue",
    padding:"0.3em"
  }
}

export class Dropdown extends Component {

  //the state determines if the dropdown is displayed or not
  constructor(props) {
    super(props);
    this.state={
      hover:false,
      hoverKey:-1
    }
  }

  hoverOn(e){
    this.setState({hover:true})
  }

  hoverOff(e){
    this.setState({hover:false})
  }

  hoverKeyOn(e){
    this.setState({hoverKey:Number(e.target.id)})
  }

  hoverKeyOff(e){
    this.setState({hoverKey:-1})
  }

  select(e){
    this.props.set(Number(e.target.id))
  }

  render () {

    let dropdownContent=dropdownStyle.dropdownContent
    if (this.state.hover){
      dropdownContent={...dropdownContent,display:"block"}
    }
    return h("div",{style:dropdownStyle.dropdown},[
      //button
      h("span",{style:dropdownStyle.button,onMouseEnter:this.hoverOn.bind(this),onMouseLeave:this.hoverOff.bind(this)
      },this.props.list[this.props.selectedID]+"[arrow.png]"),
      //content (dropdown list)
      h("div",{
        style:dropdownContent,
        onMouseEnter:this.hoverOn.bind(this),
        onMouseLeave:this.hoverOff.bind(this)
      },this.props.list.map((string,k)=>{
          //if hovered, adapt style of content
          let item=dropdownStyle.item
          if (k===this.state.hoverKey){
            item=dropdownStyle.itemHovered
          }
          //item in dropdown content
          return h("div",{
            onMouseEnter:this.hoverKeyOn.bind(this),
            onMouseLeave:this.hoverKeyOff.bind(this),
            onClick:this.select.bind(this),
            style:item,key:k,id:k
          },string)
      }))
    ])
  }
}

export default Dropdown