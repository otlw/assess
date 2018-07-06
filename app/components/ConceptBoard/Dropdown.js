// Dropdown Component : props:
// list ["string1","string2",etc],
// selectedID:integer,
// set: function (integer)=>effect

import { Component } from 'react'

import styled from 'styled-components'
import h from 'react-hyperscript'

// should be moved to style folder when it's created
// or stay here to be more easily reused

const dropdownContent = styled.div`
  display: ${(props) => props.hover ? 'block' : 'none'};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 8em;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
`
const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
  text-align: left;
`

const StyledButton = styled.div`color: red;`
const StyledItem = styled.div`
  border: 1px solid red;
  padding 0.3em;
  ${props => props.hover ? 'color:blue; \n padding: 0.3em;' : ''}
`
export class Dropdown extends Component {
  // the state determines if the dropdown is displayed or not
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      hoverKey: -1
    }
  }

  hoverOn (e) {
    this.setState({hover: true})
  }

  hoverOff (e) {
    this.setState({hover: false})
  }

  hoverKeyOn (e) {
    this.setState({hoverKey: Number(e.target.id)})
  }

  hoverKeyOff (e) {
    this.setState({hoverKey: -1})
  }

  select (e) {
    this.props.set(Number(e.target.id))
  }

  render () {
    return h(StyledDropdown, [
      h(StyledButton,
        {
          onMouseEnter: this.hoverOn.bind(this),
          onMouseLeave: this.hoverOff.bind(this)
        },
        this.props.conceptNames[this.props.selectedID] + '[arrow.png]'),
      h(dropdownContent, {
        hover: this.state.hover,
        onMouseEnter: this.hoverOn.bind(this),
        onMouseLeave: this.hoverOff.bind(this)
      }, this.props.conceptNames.map((string, k) => {
        let hover = (k === this.state.hoverKey)
        return h(StyledItem, {
          hover,
          onMouseEnter: this.hoverKeyOn.bind(this),
          onMouseLeave: this.hoverKeyOff.bind(this),
          onClick: this.select.bind(this),
          key: k,
          id: k
        }, string)
      }))
    ])
  }
}

export default Dropdown
