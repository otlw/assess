import h from 'react-hyperscript'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const NavTabs = () => {
  let activeStyle = {
    backgroundColor: 'hsla(198, 74%, 86%, 1)'
  }

  const tabContainer = styled('div').attrs({className: 'flex flex-row w-100 items-center justify-center blue pv4 bg-lightest-blue bb b--light-blue'})`
  background-color: hsla(203, 100%, 96%, 1);
  `

  const tabObjectContainer = styled('div').attrs({className: 'flex flex-row self-center ba br1 blue'})``

  const tabObjectLeft = styled('div').attrs({className: 'flex items-center  blue br'})`
  :hover {background-color:rgba(193, 230, 246,0.75);}`

  const tabObjectMiddle = styled('div').attrs({className: 'flex items-center blue'})`
  :hover {background-color:rgba(193, 230, 246,0.75);}`

  const tabObjectRight = styled('div').attrs({className: 'flex items-center  blue bl'})`
  :hover {background-color:rgba(193, 230, 246,0.75);}`

  return h(tabContainer, [
    h(tabObjectContainer, [
      h(tabObjectLeft, [
        h(NavLink, {
          to: '/concepts/',
          activeStyle: activeStyle,
          className: 'link w4 tc ph3 pv2 blue'
        }, 'Concepts ')
      ]),
      h(tabObjectMiddle, [
        h(NavLink, {
          to: '/',
          activeStyle: activeStyle,
          exact: true,
          className: 'link w4 tc ph3 pv2 blue'
        }, 'Assessments ')
      ]),
      h(tabObjectRight, [
        h(NavLink, {
          to: '/certificates/',
          activeStyle: activeStyle,
          className: 'link w4 tc ph3 pv2 blue'
        }, 'Certificates ')
      ])
    ])
  ])
}

export default NavTabs
