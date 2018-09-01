import styled from 'styled-components'

export const ProgressButtonBox = styled('div').attrs({ className: 'flex flex-row w-100 bt b--gray' })`
`

export const CloseButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const ProgressButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const PastOrPresentPhaseButton = styled('button').attrs({ className: 'flex bg-light-green flex-grow-1 pv3 justify-center pointer dark-blue ttu uppercase f5 bn' })`
`

export const FuturePhaseButton = styled('button').attrs({ className: 'flex bg-lightest-blue flex-grow-1 pv3 justify-center pointer dark-blue ttu uppercase f5 bn' })`
`

export const StageDescriptor = styled('div')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const StageName = styled('div')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const SubmitButton = styled('button')`
  display: inline-block;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const Feedback = styled.div`
  font-size: 0.7em;
  font-style: italic;
  color:${props => props.invalidScoreRange ? 'red' : 'lightgrey'};
`

export const CommitInput = styled('input')`
  display: inline-block;
  padding: 0.25em 1em;
  width: 400px;
  border: 2px solid palevioletred;
`
