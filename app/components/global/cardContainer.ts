import styled from 'styled-components'
import h from 'react-hyperscript'


const cardContainer = () => {
    return h(styleCardContainer)
}

export default cardContainer

// styles

export const styleCardContainer = styled('div').attrs({
  className: 'flex flex-column ma3 br2 shadow-4'})`
height: 420px; width: 300px;
background: linear-gradient(180.1deg, #FFFFFF 0.05%, #E9F7FD 52.48%, #CFF9EF 85.98%);
`
