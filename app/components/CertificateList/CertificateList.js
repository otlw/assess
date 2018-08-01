import CardCertificate from '../CardCertificate.js'
import h from 'react-hyperscript'
import { Stage } from '../../constants.js'
import styled from 'styled-components'

export const CertificateList = (props) => {
  let completedAsAssessee = Object.values(props.assessments).filter(
    assessment =>
      assessment.stage === Stage.Done &&
      assessment.assessee === props.userAddress &&
      assessment.finalScore >= 50
  )
  let listHeaderText = 'You successfully completed these assessments:'
  if (completedAsAssessee.length === 0) {
    return h('div', {style: assessmentListStyle.frame}, [
      h('h1', listHeaderText),
      'None'
    ])
  } else {
    return (
      h(listContainer, [
        h('h1', listHeaderText),
        h(listContainerCards, completedAsAssessee.map((assessment, k) => {
          return h(CardCertificate, {
            assessment,
            userAddress: props.userAddress
          })
        }))
      ])
    )
  }
}

export default CertificateList

// styles
const assessmentListStyle = {
  frame: {
    padding: '1em',
    border: '0.5px solid lightgrey'
  }
}

const listContainer = styled('div').attrs({className: 'flex flex-column w-100'})``

const listContainerCards = styled('div').attrs({className: 'flex flex-row flex-wrap w-100 justify-center'})``
