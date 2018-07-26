import h from 'react-hyperscript'
import { NavLink } from 'react-router-dom'
// import styled from 'styled-components'

export const NavTabs = () => {
  let activeStyle = {
    fontWeight: 'bold',
    color: 'red'
  }

  return h('div', [
    h(NavLink, { to: '/concepts/', activeStyle: activeStyle }, 'Concepts '),
    h(NavLink, { to: '/', activeStyle: activeStyle, exact: true }, 'Assessments '),
    h(NavLink, { to: '/certificates/', activeStyle: activeStyle }, 'Certificates ')
  ])
}

export default NavTabs
