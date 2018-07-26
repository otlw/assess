import h from 'react-hyperscript'
import { NavLink } from 'react-router-dom'
// import styled from 'styled-components'

export const NavTabs = () => {
  return h('div', [
    h(NavLink, { to: '/concepts/' }, 'Concepts '),
    h(NavLink, { to: '/' }, 'Assessments '),
    h(NavLink, { to: '/certificates/' }, 'Certificates ')
  ])
}

export default NavTabs
