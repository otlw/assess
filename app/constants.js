export const StageDisplayNames = Object.freeze({
  0: 'Open',
  1: 'Stake',
  2: 'Commit',
  3: 'Reveal',
  4: 'Done',
  5: 'Burned'
})

export const CompletedStages = Object.freeze({
  0: 'Open',
  1: 'Staked',
  2: 'Committed',
  3: 'Revealed',
  4: 'Completed',
  5: 'Burned'
})

export const PassiveStageDisplayNames = Object.freeze({
  1: 'Staked',
  2: 'Committed',
  3: 'Revealed',
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

// mapping of Stage (by number) to the corresponding Action an assessor/user could take
// e.g., In Stage 1 (i.e., "Called"), an assessor would 'stake'
export const UserStageAction = Object.freeze({
  0: 'none',
  1: 'stake',
  2: 'commit',
  3: 'reveal',
  4: 'done',
  5: 'burn'
})

// export const StageNumberToWord = Object.freeze({
//   0: 'none', // <-> None: 0,
//   1: 'stake', // <-> Called: 1,
//   2: 'commit', // <-> Confirmed: 2,
//   3: 'reveal', // <-> Committed: 3,
//   4: 'done', // <-> Done: 4,
//   5: 'burn' // <-> Burned: 5
// })

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
      return id.toString()
  }
}

export const NotificationTopic = Object.freeze({
  AssessmentCreated: 0,
  CalledAsAssessor: 1,
  ConfirmedAsAssessor: 2,
  AssessmentCancelled: 3,
  AssessmentStarted: 4,
  RevealScore: 5,
  TokensPaidOut: 6,
  AssessmentFinished: 7
})

export const TimeOutReasons = Object.freeze({
  NotEnoughAssessors: 1,
  NotEnoughCommits: 2,
  NotEnoughReveals: 3
})
