import h from 'react-hyperscript'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const NavTabs = () => {
  let activeStyle = {
    fontWeight: 'bold',
    color: 'red'
  }

  const tabContainer = styled('div').attrs({className: 'flex flex-row self-center ba br1 blue mv2'})``

  const tabObjectLeft = styled('div').attrs({className: 'flex items-center pv2 ph3 blue br'})``

  const tabObjectMiddle = styled('div').attrs({className: 'flex items-center pv2 ph3 blue'})``

  const tabObjectRight = styled('div').attrs({className: 'flex items-center pv2 ph3 blue bl'})``

  return h(tabContainer, [
    h(tabObjectLeft, [
      h(NavLink, { 
        to: '/concepts/', 
        activeStyle: activeStyle,
        className:"heyhey"
      }, 'Concepts ')
    ]),
    h(tabObjectMiddle, [
      h(NavLink, { 
        to: '/', 
        activeStyle: activeStyle, 
        exact: true ,
        className:"heyhey"
      }, 'Assessments ')
    ]),
    h(tabObjectRight, [
      h(NavLink, { 
        to: '/certificates/', 
        activeStyle: activeStyle,
        className:"heyhey" 
      }, 'Certificates ')
    ])
  ])
}

export default NavTabs
