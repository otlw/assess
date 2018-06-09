export const StageDisplayNames = Object.freeze({
  1: 'Open',
  2: 'Commit',
  3: 'Reveal',
  4: 'Finished'
})

export const Stage = Object.freeze({
  None: 0,
  Called: 1,
  Confirmed: 2,
  Committed: 3,
  Done: 4,
  Burned: 5
})

export const LoadingStage = Object.freeze({
  None: 0,
  Loading: 1,
  Error: 3,
  Done: 4
})
