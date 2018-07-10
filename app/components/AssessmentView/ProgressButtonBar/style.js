import styled from 'styled-components'

export const ProgressButtonBox = styled('div')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const CloseButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`
export const ProgressButton = styled('button')`
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const PastOrPresentPhaseButton = styled('button')`
  width:33%;
  background: palegreen;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
`

export const FuturePhaseButton = styled('button')`
  width:33%;
  background: paleturquoise;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
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
