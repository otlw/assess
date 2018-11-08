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

// mapping of Stage (number) to corresponding Action of assessor/user
// e.g., In Stage 1 (i.e., "Called"), an assessor would 'stake'
export const UserStageAction = Object.freeze({
  0: 'none',
  1: 'stake',
  2: 'commit',
  3: 'reveal',
  4: 'done',
  5: 'burn'
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

// Help texts // TODO: IMO we should have all texts centralized in one place, so basically I think we should bring helperContent.js here

export const HelpTexts = Object.freeze({
  assessee: 'This is the person that is being assessed in a concept. They need to pay to get assessed.',
  meetingPoint: 'This is the url where the assessee and the assessors will meet to discuss the terms of the assessment.',
  assessors: 'Those are the randomly selected users that will determine the final score and the methods for assessing it.'
})
