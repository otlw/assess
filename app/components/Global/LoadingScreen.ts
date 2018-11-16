import styled from 'styled-components'
import h from 'react-hyperscript'

const loadingFrame = styled('div').attrs({ className: 'flex  flex-column h-100 w-100 items-center justify-center' })``

const loadingGif = require('../../assets/loading_icon.gif')
const loadingText = styled('div').attrs({ className: 'flex f5' })`
`
const loadingComp = styled('img').attrs({ alt: 'loading', src: loadingGif, className: 'flex' })`
width: 200px;
`

export const LoadingScreen = (props: {title: string}) => {
  return h(loadingFrame, [
    h(loadingText, 'Loading ' + props.title + '...'),
    h(loadingComp)
  ])
}
