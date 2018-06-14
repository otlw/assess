export const StageDisplayNames = Object.freeze({
  0: 'Open',
  1: 'Stake',
  2: 'Commit',
  3: 'Reveal',
  4: 'Done',
  5: 'Burned'
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

export function networkName (id) {
  switch (id) {
    case 1:
      return 'Mainnet'
    case 3:
      return 'Ropsten'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    default:
      return 'Local'
  }
}
