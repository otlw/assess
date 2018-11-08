import styled from 'styled-components'

// Our card elements

export const cardWrapper = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4' })`
height: 420px; width: 300px;
background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #E9F7FD 85.98%);
`

export const cardContainerTop = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100 h-100' })`
`

export const cardContainerBottom = styled('div').attrs({
  className: 'relative flex content-between flex-column w-100 h-100' })`
flex-shrink: 6;
background-color: #D3ECF7;
overflow: hidden;
`

// The footer we use underneath the assessmentView (for the progressBar) and in the assessmentCreation.

export const containerFooter = styled('div').attrs({ className: 'flex flex-row w-100 pa3 items-center shadow-3' })`
margin-top: 1px;
min-height: 64px;
`
